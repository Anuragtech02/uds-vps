'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosClock, IoIosClose, IoIosSearch } from 'react-icons/io';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useSearchStore } from '@/stores/search.store';
import {
   searchContent, // Using the updated searchContent function
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
   title: string;
   shortDescription?: string;
   slug?: string;
   entity: string; // Entity type from Typesense (e.g., "api::report.report")
   locale: string;
   oldPublishedAt?: string;
   industries?: Array<{ name: string }>;
}

// Suggestions will be grouped by entity type
interface CategoryResults {
   [entityType: string]: SearchResult[];
}

// Helper to get a display-friendly name from entity type
const getEntityTypeDisplayName = (entity: string): string => {
   if (!entity) return 'General';

   switch (entity) {
      case 'api::report.report':
         return 'Reports';
      case 'api::blog.blog':
         return 'Blogs';
      case 'api::news-article.news-article':
         return 'News';
      default:
         // Fallback parsing: "api::report.report" -> "Reports"
         const parts = entity.split('::').pop()?.split('.');
         if (parts && parts.length > 1) {
            const name = parts[1].replace(/-/g, ' ');
            return name.charAt(0).toUpperCase() + name.slice(1) + 's';
         }
         return entity;
   }
};

// Helper to get tab name from entity type
const getTabFromEntity = (entity: string): string => {
   switch (entity) {
      case 'api::report.report':
         return 'reports';
      case 'api::blog.blog':
         return 'blogs';
      case 'api::news-article.news-article':
         return 'news';
      default:
         return 'reports'; // Default fallback
   }
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
   }, [query, locale]);

   const loadRecentSearches = () => {
      try {
         const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
         if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
         }
      } catch (error) {
         console.error('Error loading recent searches:', error);
         setRecentSearches([]);
      }
   };

   const saveRecentSearches = (searches: string[]) => {
      try {
         localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
         setRecentSearches(searches);
      } catch (error) {
         console.error('Error saving recent searches:', error);
      }
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
         // Use the updated searchContent function that returns transformed data
         const apiResponse = await searchContent(
            searchQuery,
            1, // page
            10, // limit - get more results for better suggestions
            {
               locale,
               // Don't specify tab to get results from all entity types
            },
         );

         // @ts-expect-error - apiResponse might not match the expected type
         if (apiResponse && (apiResponse.results || apiResponse.data)) {
            const groupedResults: CategoryResults = {};

            // Handle the transformed response format
            if (apiResponse.results) {
               // New format from updated searchContent
               Object.entries(apiResponse.results).forEach(([key, items]) => {
                  if (Array.isArray(items) && items.length > 0) {
                     // Map the key back to entity type
                     let entityType: string;
                     switch (key) {
                        case 'report':
                           entityType = 'api::report.report';
                           break;
                        case 'news-article':
                           entityType = 'api::news-article.news-article';
                           break;
                        case 'blog':
                           entityType = 'api::blog.blog';
                           break;
                        default:
                           entityType = key;
                     }

                     groupedResults[entityType] = items.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        shortDescription: item.shortDescription,
                        slug: item.slug,
                        entity: item.entity,
                        locale: item.locale,
                        oldPublishedAt: item.oldPublishedAt,
                        industries: item.industries,
                     }));
                  }
               });
               // @ts-expect-error - apiResponse.data might not match the expected type
            } else if (apiResponse.data) {
               // Fallback: Direct data array (in case transformation doesn't work)
               // @ts-expect-error - apiResponse.data might not match the expected type
               apiResponse.data.forEach((item: SearchResult) => {
                  if (!groupedResults[item.entity]) {
                     groupedResults[item.entity] = [];
                  }
                  groupedResults[item.entity].push({
                     id: item.id,
                     title: item.title,
                     shortDescription: item.shortDescription,
                     slug: item.slug,
                     entity: item.entity,
                     locale: item.locale,
                     oldPublishedAt: item.oldPublishedAt,
                     industries: item.industries,
                  });
               });
            }

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
      if (trimmedQuery.length < 1) return;

      // Save to recent searches
      const updatedSearches = [
         trimmedQuery,
         ...recentSearches.filter((s) => s !== trimmedQuery),
      ].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updatedSearches);

      setQuery('');
      onClose();

      // FIXED: Properly encode the search query for URL
      const encodedQuery = encodeURIComponent(trimmedQuery);

      // Navigate to search page
      const searchUrl =
         locale && locale !== 'en'
            ? `/${locale}/search?q=${encodedQuery}`
            : `/search?q=${encodedQuery}`;

      console.log('🔍 Navigating to search URL:', searchUrl);
      console.log('🔍 Original query:', trimmedQuery);
      console.log('🔍 Encoded query:', encodedQuery);

      router.push(searchUrl);
   };

   const handleItemClick = (result: SearchResult) => {
      if (result.slug && result.entity) {
         setQuery('');
         onClose();

         let baseUrl = locale && locale !== 'en' ? `/${locale}` : '';
         let targetUrl = '';

         // Build URL based on entity type
         switch (result.entity) {
            case 'api::report.report':
               targetUrl = `${baseUrl}/reports/${result.slug}`;
               break;
            case 'api::blog.blog':
               targetUrl = `${baseUrl}/blogs/${result.slug}`;
               break;
            case 'api::news-article.news-article':
               targetUrl = `${baseUrl}/news/${result.slug}`;
               break;
            default:
               console.warn(
                  `Unknown entity type for navigation: ${result.entity}`,
               );
               // Fallback to search with the item title
               handleSearch(result.title || '');
               return;
         }

         router.push(targetUrl);
      } else {
         // Fallback to search if slug or entity is not available
         handleSearch(result.title || '');
      }
   };

   // Also fix the handleViewAllCategory function
   const handleViewAllCategory = (entityType: string) => {
      setQuery('');
      onClose();

      const tab = getTabFromEntity(entityType);
      const currentQueryForUrl = query || '';

      // FIXED: Properly encode the search query
      const encodedQuery = encodeURIComponent(currentQueryForUrl);

      const searchUrl =
         locale && locale !== 'en'
            ? `/${locale}/search?q=${encodedQuery}&tab=${tab}`
            : `/search?q=${encodedQuery}&tab=${tab}`;

      router.push(searchUrl);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault();
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
                        onClick={() => handleSearch(search)}
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
         return (
            <div className='flex h-32 items-center justify-center'>
               <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
            </div>
         );
      }

      // Show "no results" if a search has been performed for a query >= 3 chars
      if (
         hasSearched &&
         query.length >= 3 &&
         Object.values(suggestions).every((arr) => arr.length === 0)
      ) {
         return (
            <div className='py-8 text-center text-gray-500'>
               {TRANSLATED_VALUES[locale]?.commons?.noResultsFound ||
                  'No results found for'}{' '}
               &quot;
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
                           {getEntityTypeDisplayName(entityType)}
                        </h3>
                        <button
                           onClick={() => handleViewAllCategory(entityType)}
                           className='text-xs text-blue-1 hover:underline'
                        >
                           {TRANSLATED_VALUES[locale]?.commons?.viewAll ||
                              'View All'}
                        </button>
                     </div>
                     {results.slice(0, 3).map((result: SearchResult) => (
                        <div
                           key={result.id}
                           className='cursor-pointer rounded px-3 py-2 hover:bg-gray-100'
                           onClick={() => handleItemClick(result)}
                        >
                           <div className='font-medium'>{result.title}</div>
                           {result.shortDescription && (
                              <div className='mt-1 line-clamp-2 text-sm text-gray-600'>
                                 {result.shortDescription}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               ),
         );
      }

      // If query is < 3 chars and no recent searches, show prompt
      if (query.length > 0 && query.length < 3) {
         return (
            <div className='py-8 text-center text-sm text-gray-400'>
               Please type at least 3 characters to search.
            </div>
         );
      }

      return null; // Default empty state
   };

   if (!isOpen) return null;

   return (
      <div
         className='fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 pt-[10vh] md:pt-[15vh]'
         onClick={handleModalClose}
      >
         <div
            className='flex w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl'
            onClick={(e) => e.stopPropagation()}
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
                  disabled={query.length < 1}
               >
                  {TRANSLATED_VALUES[locale]?.commons?.search || 'Search'}
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
