'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosClock, IoIosClose, IoIosSearch } from 'react-icons/io';
import { BiLoaderCircle } from 'react-icons/bi';


const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title?: string;
  name?: string;
}

interface CategoryResults {
  [key: string]: SearchResult[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<CategoryResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions({});
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if(!searchQuery) return;
    const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)]
      .slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const renderContent = () => {
    if (query === '' && recentSearches.length > 0) {
      return (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recent Searches</h3>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleSearch(search)}
            >
              <IoIosClock className="mr-2 h-4 w-4 text-gray-400" />
              {search}
            </div>
          ))}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <BiLoaderCircle className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      );
    }

    if (hasSearched && Object.values(suggestions).every(arr => arr.length === 0)) {
      return (
        <div className="text-center text-gray-500 py-8">
          No results found for "{query}". Please try a different search term.
        </div>
      );
    }

    return Object.entries(suggestions).map(([category, results]) => 
      results.length > 0 && (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 capitalize">
            {category.replace('-', ' ')}
          </h3>
          {results.map((result: SearchResult) => (
            <div
              key={result.id}
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleSearch(result.title || result.name || '')}
            >
              {result.title || result.name}
            </div>
          ))}
        </div>
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 flex items-center border-b">
          <IoIosSearch className="text-gray-400 mr-2" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow outline-none text-lg"
            placeholder="Search for reports, blogs, news articles, industries, or geographies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button title="close" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IoIosClose />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;