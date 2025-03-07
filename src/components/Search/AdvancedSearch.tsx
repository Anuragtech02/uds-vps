'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosClock, IoIosClose, IoIosSearch } from 'react-icons/io';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useSearchStore } from '@/stores/search.store';
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
   slug?: string; // Using slug instead of full URL for navigation
   type?: string; // To determine content type (report, blog, news, etc.)
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
         loadRecentSearches();
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

   const loadRecentSearches = () => {
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
         setRecentSearches(JSON.parse(storedSearches));
      }
   };

   const saveRecentSearches = (searches: string[]) => {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      setRecentSearches(searches);
   };

   const fetchSuggestions = async (searchQuery: string) => {
      if (searchQuery.length < 3) return;
      setIsLoading(true);
      setHasSearched(true);
      try {
         const data = await searchContent(
            encodeURIComponent(searchQuery),
            1,
            10,
         );
         setSuggestions(data.results);
      } catch (error) {
         console.error('Error fetching suggestions:', error);
         setSuggestions({});
      } finally {
         setIsLoading(false);
      }
   };

   const handleSearch = async (searchQuery: string) => {
      if (!searchQuery) return;

      // Update recent searches
      const updatedSearches = [
         searchQuery,
         ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updatedSearches);

      // Clear the search query and close the modal
      setQuery('');
      onClose();

      // Navigate to search page
      await router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
   };

   // Function to handle direct navigation to content pages using slugs
   const handleItemClick = async (result: SearchResult) => {
      console.log(result);
      // If slug is available, navigate directly to the content page
      if (result.slug && result.type) {
         setQuery('');
         onClose();

         // Construct the appropriate URL based on content type
         let targetUrl = '';
         switch (result.type.toLowerCase()) {
            case 'report':
            case 'reports':
               targetUrl = `/reports/${result.slug}`;
               break;
            case 'blog':
            case 'blogs':
               targetUrl = `/blogs/${result.slug}`;
               break;
            case 'news':
            case 'news-articles':
               targetUrl = `/news/${result.slug}`;
               break;
            case 'industry':
            case 'industries':
               targetUrl = `/industries/${result.slug}`;
               break;
            case 'geography':
            case 'geographies':
               targetUrl = `/geographies/${result.slug}`;
               break;
            default:
               // If type is unknown, use the category as the path
               targetUrl = `/${result.type.toLowerCase().replace(/\s+/g, '-')}/${result.slug}`;
         }

         await router.push(targetUrl);
      } else {
         // Fallback to search if slug or type is not available
         await handleSearch(result.title || result.name || '');
      }
   };

   // New function to handle "View All" for a category
   const handleViewAllCategory = async (category: string) => {
      setQuery('');
      onClose();
      // Navigate to search page with category tab selected
      await router.push(
         `/search?q=${encodeURIComponent(query)}&tab=${category}`,
      );
   };

   const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         await handleSearch(query);
      } else if (e.key === 'Escape') {
         setQuery('');
         onClose();
      }
   };

   const handleDeleteRecentSearch = (searchToDelete: string) => {
      const updatedSearches = recentSearches.filter(
         (search) => search !== searchToDelete,
      );
      saveRecentSearches(updatedSearches);
   };

   const handleModalClose = () => {
      setQuery('');
      onClose();
   };

   const renderContent = () => {
      if (query === '' && recentSearches.length > 0) {
         return (
            <div className='mb-4'>
               <h3 className='mb-2 text-sm font-semibold text-gray-500'>
                  Recent Searches
               </h3>
               {recentSearches.map((search) => (
                  <div
                     key={search}
                     className='flex items-center justify-between rounded px-3 py-2 hover:bg-gray-100'
                  >
                     <div
                        className='flex cursor-pointer items-center'
                        onClick={() => handleSearch(search)}
                     >
                        <IoIosClock className='mr-2 h-4 w-4 text-gray-400' />
                        {search}
                     </div>
                     <button
                        onClick={() => handleDeleteRecentSearch(search)}
                        className='text-gray-400 hover:text-red-400'
                        title='Delete recent search'
                     >
                        <FaTrash className='h-3 w-3' />
                     </button>
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
               No results found for &quot;{query}&quot;. Please try a different
               search term.
            </div>
         );
      }

      return Object.entries(suggestions).map(
         ([category, results]) =>
            results.length > 0 && (
               <div key={category} className='mb-4'>
                  <div className='mb-2 flex items-center justify-between'>
                     <h3 className='text-sm font-semibold capitalize text-gray-500'>
                        {category.replace('-', ' ')}
                     </h3>
                     <button
                        onClick={() => handleViewAllCategory(category)}
                        className='text-xs text-blue-500 hover:underline'
                     >
                        View All
                     </button>
                  </div>
                  {results.map((result: SearchResult) => (
                     <div
                        key={result.id ?? result.title ?? result.name}
                        className='cursor-pointer rounded px-3 py-2 hover:bg-gray-100'
                        onClick={() =>
                           handleItemClick({ ...result, type: category })
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
      <div
         className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
         onClick={handleModalClose}
      >
         <div className='w-full max-w-2xl rounded-lg bg-white shadow-xl'>
            <div
               className={`flex items-center ${query?.length >= 3 ? 'border-b' : ''} p-4`}
               onClick={(e) => e.stopPropagation()}
            >
               <IoIosSearch className='mr-2 text-gray-400' />
               <input
                  ref={inputRef}
                  type='text'
                  className='flex-grow text-lg outline-none'
                  placeholder='Search for reports, blogs, news articles & more...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
               />
               {query.length > 0 && (
                  <button
                     title='Clear search'
                     onClick={() => setQuery('')}
                     className='mr-2 text-2xl text-gray-400 hover:text-gray-600'
                  >
                     <IoIosClose />
                  </button>
               )}
               <button
                  onClick={() => handleSearch(query)}
                  className='cursor-pointer rounded-md bg-blue-1 px-4 py-2 text-white transition-colors hover:bg-blue-2'
                  disabled={query.length < 3}
               >
                  Search
               </button>
            </div>
            <p className='absolute px-4 py-2 text-right text-xs text-white'>
               * Min. 3 characters
            </p>
            {query?.length >= 3 && (
               <div className='max-h-96 overflow-y-auto p-4'>
                  {renderContent()}
               </div>
            )}
         </div>
      </div>
   );
};

export default AdvancedSearch;
