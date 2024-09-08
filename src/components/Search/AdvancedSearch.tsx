'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosClock, IoIosClose, IoIosSearch } from 'react-icons/io';
import { BiLoaderCircle } from 'react-icons/bi';
import { useSearchStore } from '@/stores/search.store';
import fetchClientCSR from '@/utils/api/csr-config';
import { searchContent } from '@/utils/api/csr-services';

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
   const searchStore = useSearchStore();
   const { query, setQuery } = searchStore;
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
         const data = await searchContent(encodeURIComponent(searchQuery));
         setSuggestions(data.results);
      } catch (error) {
         console.error('Error fetching suggestions:', error);
         setSuggestions({});
      } finally {
         setIsLoading(false);
      }
   };

   const handleSearch = (searchQuery: string) => {
      if (!searchQuery) return;
      const updatedSearches = [
         searchQuery,
         ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(
         RECENT_SEARCHES_KEY,
         JSON.stringify(updatedSearches),
      );

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
            <div className='mb-4'>
               <h3 className='mb-2 text-sm font-semibold text-gray-500'>
                  Recent Searches
               </h3>
               {recentSearches.map((search, index) => (
                  <div
                     key={index}
                     className='flex cursor-pointer items-center rounded px-3 py-2 hover:bg-gray-100'
                     onClick={() => handleSearch(search)}
                  >
                     <IoIosClock className='mr-2 h-4 w-4 text-gray-400' />
                     {search}
                  </div>
               ))}
            </div>
         );
      }

      if (isLoading) {
         return (
            <div className='flex h-32 items-center justify-center'>
               <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
            </div>
         );
      }

      if (
         hasSearched &&
         Object.values(suggestions).every((arr) => arr.length === 0)
      ) {
         return (
            <div className='py-8 text-center text-gray-500'>
               No results found for "{query}". Please try a different search
               term.
            </div>
         );
      }

      return Object.entries(suggestions).map(
         ([category, results]) =>
            results.length > 0 && (
               <div key={category} className='mb-4'>
                  <h3 className='mb-2 text-sm font-semibold capitalize text-gray-500'>
                     {category.replace('-', ' ')}
                  </h3>
                  {results.map((result: SearchResult) => (
                     <div
                        key={result.id}
                        className='cursor-pointer rounded px-3 py-2 hover:bg-gray-100'
                        onClick={() =>
                           handleSearch(result.title || result.name || '')
                        }
                     >
                        {result.title || result.name}
                     </div>
                  ))}
               </div>
            ),
      );
   };

   if (!isOpen) return null;

   return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
         <div className='w-full max-w-2xl rounded-lg bg-white shadow-xl'>
            <div className='flex items-center border-b p-4'>
               <IoIosSearch className='mr-2 text-gray-400' />
               <input
                  ref={inputRef}
                  type='text'
                  className='flex-grow text-lg outline-none'
                  placeholder='Search for reports, blogs, news articles, industries, or geographies...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
               />
               <button
                  title='close'
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-600'
               >
                  <IoIosClose />
               </button>
            </div>
            <div className='max-h-96 overflow-y-auto p-4'>
               {renderContent()}
            </div>
         </div>
      </div>
   );
};

export default AdvancedSearch;
