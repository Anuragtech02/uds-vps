'use client';
import { useEffect, useState, useCallback } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';
import { searchContent } from '@/utils/api/csr-services';
import { useRouter, useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

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

   const fetchResults = useCallback(async () => {
      setIsLoading(true);
      setHasSearched(true);

      const currentPage = pages[activeTab];
      const searchQuery = searchParams.get('q') || '';
      const industries = searchParams.get('industries') || '';
      const geographies = searchParams.get('geographies') || '';
      const sortBy = searchParams.get('sortBy') || 'relevance';

      try {
         const response = await searchContent(
            encodeURIComponent(searchQuery),
            currentPage,
            ITEMS_PER_PAGE,
            {
               industries: industries.split(',').filter(Boolean),
               geographies: geographies.split(',').filter(Boolean),
               sortBy,
            },
         );

         setData({
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
         console.error('Error fetching results:', error);
         setData({
            report: { data: [], total: 0 },
            'news-article': { data: [], total: 0 },
            blog: { data: [], total: 0 },
         });
      } finally {
         setIsLoading(false);
      }
   }, [searchParams, pages, activeTab]);

   // Update URL when tab or page changes
   const updateURL = useCallback(
      (newTab: string, newPage: number) => {
         const params = new URLSearchParams(searchParams.toString());
         params.set('tab', newTab);
         params.set(`${newTab}Page`, newPage.toString());
         router.push(`?${params.toString()}`);
      },
      [router, searchParams],
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
         reports: data.report.total,
         news: data['news-article'].total,
         blogs: data.blog.total,
      };
      return Math.ceil(totals[activeTab] / ITEMS_PER_PAGE);
   }, [data, activeTab]);

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
               } ${data.report.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('reports')}
               disabled={data.report.total === 0}
               type='button'
            >
               Reports ({data.report.total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${
                  activeTab === 'news'
                     ? 'bg-blue-50 text-blue-600'
                     : 'hover:bg-gray-50'
               } ${data['news-article'].total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('news')}
               disabled={data['news-article'].total === 0}
               type='button'
            >
               News ({data['news-article'].total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${
                  activeTab === 'blogs'
                     ? 'bg-blue-50 text-blue-600'
                     : 'hover:bg-gray-50'
               } ${data.blog.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('blogs')}
               disabled={data.blog.total === 0}
               type='button'
            >
               Blogs ({data.blog.total})
            </button>
         </div>

         {/* Results content */}
         <div>
            {isLoading ? (
               <SkeletonLoader />
            ) : (
               <>
                  {activeTab === 'reports' && (
                     <ReportResults reports={data.report.data} />
                  )}
                  {activeTab === 'news' && (
                     <NewsResults news={data['news-article'].data} />
                  )}
                  {activeTab === 'blogs' && (
                     <BlogResults blogs={data.blog.data} />
                  )}

                  {!hasSearched && (
                     <p className='mt-8 text-center text-gray-500'>
                        Enter a search term to see results
                     </p>
                  )}

                  {hasSearched &&
                     Object.values(data).every((item) => !item.data.length) && (
                        <div className='mt-8 text-center'>
                           <p className='text-lg text-gray-600'>
                              No results found
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
                  Previous
               </button>
               <span className='text-sm text-gray-700'>
                  Page <span className='font-medium'>{currentPage}</span> of{' '}
                  <span className='font-medium'>{totalPages}</span>
               </span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
               >
                  Next
               </button>
            </div>
         )}
      </div>
   );
};

export default SearchResults;
