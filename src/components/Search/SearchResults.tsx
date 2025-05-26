'use client';
import { useEffect, useState, useCallback } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';
import { searchContent } from '@/utils/api/csr-services';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

const ITEMS_PER_PAGE = 10;

// types/search.ts
// Updated type definitions for search functionality

// types/search.ts
// Updated type definitions for search functionality

export interface SearchResultItem {
   id: string;
   title: string;
   shortDescription?: string;
   slug: string;
   entity: string;
   locale: string;
   highlightImage?: string;
   oldPublishedAt?: string;
   industries?: Array<{ name: string }>;
   geographies?: Array<{ name: string }>; // Only available for reports
}

export interface SearchResponse {
   data: SearchResultItem[];
   meta: {
      pagination: {
         page: number;
         pageSize: number;
         pageCount: number;
         total: number;
         allCounts: {
            all: number;
            'api::report.report': number;
            'api::blog.blog': number;
            'api::news-article.news-article': number;
         };
      };
   };
}

export interface TransformedSearchResponse {
   results: {
      report: SearchResultItem[];
      'news-article': SearchResultItem[];
      blog: SearchResultItem[];
   };
   totals: {
      report: number;
      'news-article': number;
      blog: number;
   };
}

export interface SearchOptions {
   industries?: string[];
   geographies?: string[];
   sortBy?: string;
   locale?: string;
   tab?: 'reports' | 'news' | 'blogs';
}

export type ContentTab = 'reports' | 'news' | 'blogs';

export interface SearchFilters {
   industries: string[];
   geographies: string[];
   sortBy: string;
}

interface SearchResult {
   report: { data: any[]; total: number };
   'news-article': { data: any[]; total: number };
   blog: { data: any[]; total: number };
}

const SkeletonLoader = () => (
   <div className='animate-pulse space-y-4'>
      {[...Array(5)].map((_, index) => (
         <div key={index} className='h-24 rounded-md bg-gray-200' />
      ))}
   </div>
);

const SearchResults = () => {
   const router = useRouter();
   const searchParams = useSearchParams();

   // Parse active tab and pages from URL
   const getInitialState = () => {
      const tab = searchParams.get('tab') || 'reports';
      return {
         activeTab: tab as 'reports' | 'news' | 'blogs',
         pages: {
            reports: parseInt(searchParams.get('reportsPage') || '1', 10),
            news: parseInt(searchParams.get('newsPage') || '1', 10),
            blogs: parseInt(searchParams.get('blogsPage') || '1', 10),
         },
      };
   };

   const [activeTab, setActiveTab] = useState<'reports' | 'news' | 'blogs'>(
      getInitialState().activeTab,
   );
   const [pages, setPages] = useState(getInitialState().pages);
   const [isLoading, setIsLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);
   const [data, setData] = useState<SearchResult>({
      report: { data: [], total: 0 },
      'news-article': { data: [], total: 0 },
      blog: { data: [], total: 0 },
   });
   const [allTabsData, setAllTabsData] = useState<SearchResult>({
      report: { data: [], total: 0 },
      'news-article': { data: [], total: 0 },
      blog: { data: [], total: 0 },
   });

   const { locale } = useLocale();

   // Fetch data for all tabs to get accurate counts
   const fetchAllTabsData = useCallback(async () => {
      const searchQuery = searchParams.get('q') || '';
      const industries = searchParams.get('industries') || '';
      const geographies = searchParams.get('geographies') || '';
      const sortBy = searchParams.get('sortBy') || 'relevance';

      try {
         // FIXED: Remove encodeURIComponent wrapper
         const response = await searchContent(
            searchQuery, // ✅ Changed from encodeURIComponent(searchQuery)
            1,
            1,
            {
               industries: industries.split(',').filter(Boolean),
               geographies: geographies.split(',').filter(Boolean),
               sortBy,
               locale,
            },
         );

         setAllTabsData({
            report: {
               data: response.results.report || [],
               total: response.totals.report || 0,
            },
            'news-article': {
               data: response.results['news-article'] || [],
               total: response.totals['news-article'] || 0,
            },
            blog: {
               data: response.results.blog || [],
               total: response.totals.blog || 0,
            },
         });
      } catch (error) {
         console.error('Error fetching all tabs data:', error);
      }
   }, [searchParams, locale]);

   // 2. Fix fetchResults function (around line 135):
   const fetchResults = useCallback(async () => {
      setIsLoading(true);
      setHasSearched(true);

      const currentPage = pages[activeTab];
      const searchQuery = searchParams.get('q') || '';
      const industries = searchParams.get('industries') || '';
      const geographies = searchParams.get('geographies') || '';
      const sortBy = searchParams.get('sortBy') || 'relevance';

      try {
         // FIXED: Remove encodeURIComponent wrapper
         const response = await searchContent(
            searchQuery, // ✅ Changed from encodeURIComponent(searchQuery)
            currentPage,
            ITEMS_PER_PAGE,
            {
               industries: industries.split(',').filter(Boolean),
               geographies:
                  activeTab === 'reports' || !activeTab
                     ? geographies.split(',').filter(Boolean)
                     : [],
               sortBy,
               locale,
               tab: activeTab,
            },
         );

         // Update current tab data
         setData({
            report: {
               data:
                  activeTab === 'reports' ? response.results.report || [] : [],
               total: response.totals.report || 0,
            },
            'news-article': {
               data:
                  activeTab === 'news'
                     ? response.results['news-article'] || []
                     : [],
               total: response.totals['news-article'] || 0,
            },
            blog: {
               data: activeTab === 'blogs' ? response.results.blog || [] : [],
               total: response.totals.blog || 0,
            },
         });

         // Also fetch all tabs data for accurate counts
         await fetchAllTabsData();
      } catch (error) {
         console.error('Error fetching results:', error);
         setData({
            report: { data: [], total: 0 },
            'news-article': { data: [], total: 0 },
            blog: { data: [], total: 0 },
         });
         setAllTabsData({
            report: { data: [], total: 0 },
            'news-article': { data: [], total: 0 },
            blog: { data: [], total: 0 },
         });
      } finally {
         setIsLoading(false);
      }
   }, [searchParams, pages, activeTab, locale, fetchAllTabsData]);
   // Update URL when tab or page changes
   const updateURL = useCallback(
      (newTab: string, newPage: number) => {
         const params = new URLSearchParams(searchParams.toString());
         params.set('tab', newTab);
         params.set(`${newTab}Page`, newPage.toString());

         // Ensure locale is preserved in the URL
         if (locale && !params.has('locale')) {
            params.set('locale', locale);
         }

         router.push(`?${params.toString()}`);
      },
      [router, searchParams, locale],
   );

   // Handle tab change
   const handleTabChange = useCallback(
      (tab: 'reports' | 'news' | 'blogs') => {
         setActiveTab(tab);
         const currentPage = pages[tab];
         updateURL(tab, currentPage);
      },
      [pages, updateURL],
   );

   // Handle page change
   const handlePageChange = useCallback(
      (newPage: number) => {
         setPages((prev) => ({
            ...prev,
            [activeTab]: newPage,
         }));
         updateURL(activeTab, newPage);
      },
      [activeTab, updateURL],
   );

   // Effect to fetch data when URL params change
   useEffect(() => {
      fetchResults();
   }, [fetchResults]);

   // Calculate total pages for current tab
   const getTotalPages = useCallback(() => {
      const totals = {
         reports: allTabsData.report.total,
         news: allTabsData['news-article'].total,
         blogs: allTabsData.blog.total,
      };
      return Math.ceil(totals[activeTab] / ITEMS_PER_PAGE);
   }, [allTabsData, activeTab]);

   const currentPage = pages[activeTab];
   const totalPages = getTotalPages();

   return (
      <div className='space-y-4 pb-4 md:space-y-6'>
         <div className='flex items-center gap-4'>
            {/* Tab buttons */}
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${
                  activeTab === 'reports'
                     ? 'bg-blue-50 text-blue-600'
                     : 'hover:bg-gray-50'
               } ${allTabsData.report.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('reports')}
               disabled={allTabsData.report.total === 0}
               type='button'
            >
               {TRANSLATED_VALUES[locale]?.header.reports} (
               {allTabsData.report.total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${
                  activeTab === 'news'
                     ? 'bg-blue-50 text-blue-600'
                     : 'hover:bg-gray-50'
               } ${allTabsData['news-article'].total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('news')}
               disabled={allTabsData['news-article'].total === 0}
               type='button'
            >
               {TRANSLATED_VALUES[locale]?.header.news} (
               {allTabsData['news-article'].total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${
                  activeTab === 'blogs'
                     ? 'bg-blue-50 text-blue-600'
                     : 'hover:bg-gray-50'
               } ${allTabsData.blog.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('blogs')}
               disabled={allTabsData.blog.total === 0}
               type='button'
            >
               {TRANSLATED_VALUES[locale]?.header.blogs} (
               {allTabsData.blog.total})
            </button>
         </div>

         {/* Results content */}
         <div>
            {isLoading ? (
               <SkeletonLoader />
            ) : (
               <>
                  {activeTab === 'reports' && (
                     <ReportResults
                        reports={data.report.data}
                        locale={locale}
                     />
                  )}
                  {activeTab === 'news' && (
                     <NewsResults
                        news={data['news-article'].data}
                        locale={locale}
                     />
                  )}
                  {activeTab === 'blogs' && (
                     <BlogResults blogs={data.blog.data} locale={locale} />
                  )}

                  {!hasSearched && (
                     <p className='mt-8 text-center text-gray-500'>
                        Enter a search term to see results
                     </p>
                  )}

                  {hasSearched &&
                     Object.values(allTabsData).every(
                        (item) => !item.total,
                     ) && (
                        <div className='mt-8 text-center'>
                           <p className='text-lg text-gray-600'>
                              {
                                 TRANSLATED_VALUES[locale]?.commons
                                    .noResultsFound
                              }
                           </p>
                           <p className='mt-2 text-gray-500'>
                              Try adjusting your search terms or filters
                           </p>
                        </div>
                     )}
               </>
            )}
         </div>

         {/* Pagination */}
         {!isLoading && totalPages > 1 && (
            <div className='mt-4 flex items-center justify-center space-x-4'>
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
               >
                  {TRANSLATED_VALUES[locale]?.commons.prev}
               </button>
               <span className='text-sm text-gray-700'>
                  {TRANSLATED_VALUES[locale]?.commons.page}{' '}
                  <span className='font-medium'>{currentPage}</span>{' '}
                  {TRANSLATED_VALUES[locale]?.commons.of}{' '}
                  <span className='font-medium'>{totalPages}</span>
               </span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
               >
                  {TRANSLATED_VALUES[locale]?.commons.next}
               </button>
            </div>
         )}
      </div>
   );
};

export default SearchResults;
