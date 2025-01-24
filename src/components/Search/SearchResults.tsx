'use client';
import { useEffect, useState } from 'react';
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
         <div key={index} className='h-24 rounded-md bg-gray-200'></div>
      ))}
   </div>
);

const SearchResults = () => {
   const [activeTab, setActiveTab] = useState<'reports' | 'news' | 'blogs'>(
      'reports',
   );
   const [isLoading, setIsLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);
   const [pages, setPages] = useState({
      reports: 1,
      news: 1,
      blogs: 1,
   });
   const [data, setData] = useState<SearchResult>({
      report: { data: [], total: 0 },
      'news-article': { data: [], total: 0 },
      blog: { data: [], total: 0 },
   });
   const [totalItems, setTotalItems] = useState(0);

   const router = useRouter();
   const searchParams = useSearchParams();

   const fetchResults = async (page: number) => {
      setIsLoading(true);
      setHasSearched(true);

      // Get all search parameters
      const searchQuery = searchParams.get('q') || '';
      const industries = searchParams.get('industries') || '';
      const geographies = searchParams.get('geographies') || '';
      const sortBy = searchParams.get('sortBy') || 'relevance';

      try {
         const data = await searchContent(
            encodeURIComponent(searchQuery),
            page,
            ITEMS_PER_PAGE,
            {
               industries: industries.split(',').filter(Boolean),
               geographies: geographies.split(',').filter(Boolean),
               sortBy,
            },
         );

         setData({
            report: {
               data: data.results.report || [],
               total: data.totals.report || 0,
            },
            'news-article': {
               data: data.results['news-article'] || [],
               total: data.totals['news-article'] || 0,
            },
            blog: {
               data: data.results.blog || [],
               total: data.totals.blog || 0,
            },
         });
         setTotalItems(data.total);

         // // Set active tab based on which type has results
         // if (data.results?.report?.length > 0) {
         //    setActiveTab('reports');
         // } else if (data.results?.['news-article']?.length > 0) {
         //    setActiveTab('news');
         // } else if (data.results?.blog?.length > 0) {
         //    setActiveTab('blogs');
         // }
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
   };

   useEffect(() => {
      const tab = searchParams.get('tab') || 'reports';
      const reportsPage = parseInt(searchParams.get('reportsPage') || '1', 10);
      const newsPage = parseInt(searchParams.get('newsPage') || '1', 10);
      const blogsPage = parseInt(searchParams.get('blogsPage') || '1', 10);

      setActiveTab(tab as 'reports' | 'news' | 'blogs');
      setPages({
         reports: reportsPage,
         news: newsPage,
         blogs: blogsPage,
      });

      fetchResults(pages[tab as keyof typeof pages]);
   }, [searchParams]);

   const handlePageChange = (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      const pageParam =
         activeTab === 'reports'
            ? 'reportsPage'
            : activeTab === 'news'
              ? 'newsPage'
              : 'blogsPage';
      params.set(pageParam, newPage.toString());
      router.push(`?${params.toString()}`);
   };

   const handleTabChange = (tab: 'reports' | 'news' | 'blogs') => {
      setActiveTab(tab); // Add this
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      router.push(`?${params.toString()}`);
   };

   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   const getTotalPages = () => {
      const totals = {
         reports: data.report.total,
         news: data['news-article'].total,
         blogs: data.blog.total,
      };
      return Math.ceil(totals[activeTab] / ITEMS_PER_PAGE);
   };

   return (
      <div className='space-y-4 pb-4 md:space-y-6'>
         <div className='flex items-center gap-4'>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${data.report.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('reports')}
               disabled={data.report.total === 0}
               type='button'
            >
               Reports ({data.report.total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'news' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${data['news-article'].total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('news')}
               disabled={data['news-article'].total === 0}
               type='button'
            >
               News ({data['news-article'].total})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'blogs' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${data.blog.total === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('blogs')}
               disabled={data.blog.total === 0}
               type='button'
            >
               Blogs ({data.blog.total})
            </button>
         </div>

         <div>
            {isLoading ? (
               <SkeletonLoader />
            ) : (
               <>
                  {activeTab === 'reports' && (
                     <ReportResults reports={data?.report.data} />
                  )}
                  {activeTab === 'news' && (
                     <NewsResults news={data?.['news-article'].data} />
                  )}
                  {activeTab === 'blogs' && (
                     <BlogResults blogs={data?.blog?.data as any} />
                  )}

                  {!hasSearched && (
                     <p className='mt-8 text-center text-gray-500'>
                        Enter a search term to see results
                     </p>
                  )}

                  {hasSearched &&
                     Object.values(data).every((arr) => !arr?.data?.length) && (
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

         {!isLoading && getTotalPages() > 1 && (
            <div className='mt-4 flex items-center justify-center space-x-4'>
               <button
                  onClick={() =>
                     handlePageChange(
                        pages[activeTab as keyof typeof pages] - 1,
                     )
                  }
                  disabled={pages[activeTab as keyof typeof pages] === 1}
                  className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
               >
                  Previous
               </button>
               <span className='text-sm text-gray-700'>
                  Page{' '}
                  <span className='font-medium'>
                     {pages[activeTab as keyof typeof pages]}
                  </span>{' '}
                  of <span className='font-medium'>{getTotalPages()}</span>
               </span>
               <button
                  onClick={() =>
                     handlePageChange(
                        pages[activeTab as keyof typeof pages] + 1,
                     )
                  }
                  disabled={
                     pages[activeTab as keyof typeof pages] === getTotalPages()
                  }
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
