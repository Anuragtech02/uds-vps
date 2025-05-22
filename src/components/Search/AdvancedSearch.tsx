'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosClock, IoIosClose, IoIosSearch } from 'react-icons/io';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useSearchStore } from '@/stores/search.store';
import {
   searchContent, // Assuming searchContent is updated or handles the new API
} from '@/utils/api/csr-services';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

interface AdvancedSearchProps {
   isOpen: boolean;
   onClose: () => void;
}

// Updated to match Typesense response structure
interface SearchResult {
   id: string;
   title: string; // Typesense provides 'title'
   slug?: string;
   entity: string; // This is the primary type identifier from Typesense
   // 'name' is removed as 'title' is the standard from your Typesense response
   // 'type' is removed as 'entity' serves this purpose
}

// Suggestions will be keyed by entity type (e.g., "api::report.report")
interface CategoryResults {
   [entityType: string]: SearchResult[];
}

// Helper to get a display-friendly name from entity type
const getEntityTypeDisplayName = (entity: string): string => {
   if (!entity) return 'General';
   // "api::report.report" -> "Report"
   const parts = entity.split('::').pop()?.split('.');
   if (parts && parts.length > 1) {
      const name = parts[1].replace(/-/g, ' ');
      return name.charAt(0).toUpperCase() + name.slice(1) + 's'; // Capitalize and pluralize
   }
   return entity; // Fallback
};

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
   const searchStore = useSearchStore();
   const { query, setQuery } = searchStore;
   const [recentSearches, setRecentSearches] = useState<string[]>([]);
   const [suggestions, setSuggestions] = useState<CategoryResults>({});
   const [isLoading, setIsLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);
   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);

   const { locale } = useLocale();

   useEffect(() => {
      if (isOpen) {
         inputRef.current?.focus();
         loadRecentSearches();
      }
   }, [isOpen]);

   useEffect(() => {
      const debounceTimer = setTimeout(() => {
         if (query && query.length >= 3) {
            fetchSuggestions(query);
         } else {
            setSuggestions({});
            setHasSearched(false);
         }
      }, 300);
      return () => clearTimeout(debounceTimer);
   }, [query, locale]); // Added locale as a dependency if searchContent uses it

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
      if (searchQuery.length < 3) {
         setSuggestions({});
         setHasSearched(false);
         return;
      }
      setIsLoading(true);
      setHasSearched(true);
      try {
         // Assuming searchContent now calls your Strapi endpoint which hits Typesense
         // The response structure is { data: SearchResult[], meta: { pagination: ... } }
         const apiResponse = await searchContent(
            searchQuery, // No need to encodeURIComponent here if searchContent handles it
            1,
            10,
            {
               locale,
            },
         );

         if (apiResponse && apiResponse.data) {
            const groupedResults: CategoryResults = {};
            apiResponse.data.forEach((item: SearchResult) => {
               if (!groupedResults[item.entity]) {
                  groupedResults[item.entity] = [];
               }
               // Ensure all necessary fields are present, matching SearchResult interface
               groupedResults[item.entity].push({
                  id: item.id,
                  title: item.title,
                  slug: item.slug,
                  entity: item.entity,
               });
            });
            setSuggestions(groupedResults);
         } else {
            setSuggestions({});
         }
      } catch (error) {
         console.error('Error fetching suggestions:', error);
         setSuggestions({});
      } finally {
         setIsLoading(false);
      }
   };

   const handleSearch = async (searchQuery: string) => {
      if (!searchQuery) return;

      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length < 1) return; // Or < 3 if you want to enforce min length for full search too

      const updatedSearches = [
         trimmedQuery,
         ...recentSearches.filter((s) => s !== trimmedQuery),
      ].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updatedSearches);

      setQuery('');
      onClose();

      let newUrl =
         locale && locale !== 'en'
            ? `/${locale}/search?q=${encodeURIComponent(trimmedQuery)}`
            : '/search?q=${encodeURIComponent(trimmedQuery)}';
      router.push(newUrl);
   };

   const handleItemClick = (result: SearchResult) => {
      if (result.slug && result.entity) {
         setQuery('');
         onClose();

         let targetUrl = '';
         if (locale && locale !== 'en') {
            targetUrl = `/${locale}`;
         }
         // Using entity directly from Typesense response
         switch (result.entity) {
            case 'api::report.report':
               targetUrl = `/reports/${result.slug}`;
               break;
            case 'api::blog.blog':
               targetUrl = `/blogs/${result.slug}`;
               break;
            case 'api::news-article.news-article':
               targetUrl = `/news/${result.slug}`;
               break;
            // Add cases for other entities like industries, geographies if they are separate types
            // For example, if 'industries' were an entity type from Typesense:
            // case 'api::industry.industry':
            //   targetUrl = `/industries/${result.slug}`;
            //   break;
            default:
               // Fallback for unmapped entities, perhaps to a generic search or log an error
               console.warn(
                  `Unknown entity type for navigation: ${result.entity}`,
               );
               // Fallback to general search page with the query of the item title
               handleSearch(result.title || '');
               return;
         }
         router.push(targetUrl);
      } else {
         // Fallback to search if slug or entity is not available
         handleSearch(result.title || '');
      }
   };

   const handleViewAllCategory = (entityType: string) => {
      setQuery('');
      onClose();

      let tab = '';
      switch (entityType) {
         case 'api::report.report':
            tab = 'reports';
            break;
         case 'api::news-article.news-article':
            tab = 'news';
            break;
         case 'api::blog.blog':
            tab = 'blogs';
            break;
         default:
            // Fallback or default tab if entityType doesn't match a specific tab
            // For example, if 'reports' is your main/default tab
            tab = 'reports';
      }
      // Ensure query is defined for the URL, even if it's empty for "view all" from suggestions
      const currentQueryForUrl = query || '';
      // Using router.push for SPA navigation
      router.push(
         `/search?q=${encodeURIComponent(currentQueryForUrl)}&tab=${tab}&${tab}Page=1`,
      );
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault(); // Prevent form submission if it's in a form
         handleSearch(query);
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
      // setQuery(''); // Optionally clear query on modal close via overlay click
      onClose();
   };

   const renderContent = () => {
      // Show recent searches if query is empty (or less than 3 chars) and recent searches exist
      if (query.length < 3 && recentSearches.length > 0) {
         return (
            <div className='mb-4'>
               <h3 className='mb-2 text-sm font-semibold text-gray-500'>
                  {TRANSLATED_VALUES[locale]?.commons?.recentSearches ||
                     'Recent Searches'}
               </h3>
               {recentSearches.map((search) => (
                  <div
                     key={search}
                     className='flex items-center justify-between rounded px-3 py-2 hover:bg-gray-100'
                  >
                     <div
                        className='flex flex-1 cursor-pointer items-center truncate'
                        onClick={() => {
                           setQuery(search); // Set query and let useEffect trigger search
                           // handleSearch(search); // Or directly search
                        }}
                     >
                        <IoIosClock className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400' />
                        <span className='truncate'>{search}</span>
                     </div>
                     <button
                        onClick={() => handleDeleteRecentSearch(search)}
                        className='ml-2 text-gray-400 hover:text-red-400'
                        title='Delete recent search'
                     >
                        <FaTrash className='h-3 w-3 flex-shrink-0' />
                     </button>
                  </div>
               ))}
            </div>
         );
      }

      if (isLoading && query.length >= 3) {
         // Only show loader if actively searching
         return (
            <div className='flex h-32 items-center justify-center'>
               <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
            </div>
         );
      }
      // Only show "no results" if a search has been performed for a query >= 3 chars
      if (
         hasSearched &&
         query.length >= 3 &&
         Object.values(suggestions).every((arr) => arr.length === 0)
      ) {
         return (
            <div className='py-8 text-center text-gray-500'>
               {TRANSLATED_VALUES[locale]?.commons?.noResultsFound} &quot;
               {query}&quot;.
            </div>
         );
      }

      // Render suggestions if query is long enough
      if (query.length >= 3) {
         return Object.entries(suggestions).map(
            ([entityType, results]) =>
               results.length > 0 && (
                  <div key={entityType} className='mb-4'>
                     <div className='mb-2 flex items-center justify-between'>
                        <h3 className='text-sm font-semibold capitalize text-gray-500'>
                           {TRANSLATED_VALUES[locale]?.header?.[
                              getEntityTypeDisplayName(entityType).toLowerCase()
                           ] || getEntityTypeDisplayName(entityType)}
                        </h3>
                        <button
                           onClick={() => handleViewAllCategory(entityType)}
                           className='text-xs text-blue-1 hover:underline'
                        >
                           {TRANSLATED_VALUES[locale]?.commons?.viewAll}
                        </button>
                     </div>
                     {results.map((result: SearchResult) => (
                        <div
                           key={result.id} // Use unique ID from Typesense
                           className='cursor-pointer rounded px-3 py-2 hover:bg-gray-100'
                           onClick={() => handleItemClick(result)}
                        >
                           {result.title}
                        </div>
                     ))}
                  </div>
               ),
         );
      }
      // If query is < 3 chars and no recent searches, show nothing or a prompt
      if (query.length > 0 && query.length < 3) {
         return (
            <div className='py-8 text-center text-sm text-gray-400'>
               Please type at least 3 characters.
            </div>
         );
      }

      return null; // Default empty state
   };

   if (!isOpen) return null;

   return (
      <div
         className='fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 pt-[10vh] md:pt-[15vh]'
         onClick={handleModalClose} // Close when clicking overlay
      >
         <div
            className='flex w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl'
            onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
         >
            <div className={`flex items-center border-b p-4`}>
               <IoIosSearch className='mr-3 h-5 w-5 text-gray-400' />
               <input
                  ref={inputRef}
                  type='text'
                  className='flex-grow text-base placeholder-gray-500 outline-none md:text-lg'
                  placeholder={
                     TRANSLATED_VALUES[locale]?.header.searchPlaceholder ||
                     'Search reports, blogs, news...'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
               />
               {query.length > 0 && (
                  <button
                     title='Clear search'
                     onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                     }}
                     className='ml-2 mr-2 text-2xl text-gray-400 hover:text-gray-600'
                  >
                     <IoIosClose />
                  </button>
               )}
               <button
                  onClick={() => handleSearch(query)}
                  className='rounded bg-blue-1 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-2 disabled:opacity-50'
                  disabled={query.length < 1} // Allow search for any length, suggestions trigger at 3
               >
                  {TRANSLATED_VALUES[locale]?.commons?.search}
               </button>
            </div>

            <div className='max-h-[60vh] overflow-y-auto p-4'>
               {renderContent()}
            </div>
         </div>
      </div>
   );
};

export default AdvancedSearch;
