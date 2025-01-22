'use client';
import { useEffect, useState } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';
import { searchContent } from '@/utils/api/csr-services';
import { useRouter, useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

interface SearchResult {
   report?: any[];
   'news-article'?: any[];
   blog?: any[];
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
   const [data, setData] = useState<SearchResult>({});
   const [currentPage, setCurrentPage] = useState(1);
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

         setData(data.results);
         setTotalItems(data.total);

         // Set active tab based on which type has results
         if (data.results?.report?.length > 0) {
            setActiveTab('reports');
         } else if (data.results?.['news-article']?.length > 0) {
            setActiveTab('news');
         } else if (data.results?.blog?.length > 0) {
            setActiveTab('blogs');
         }
      } catch (error) {
         console.error('Error fetching results:', error);
         setData({});
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      const page = parseInt(searchParams.get('page') || '1', 10);
      setCurrentPage(page);
      fetchResults(page);
   }, [searchParams]); // This will now react to all search parameter changes

   const handlePageChange = (newPage: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('page', newPage.toString());
      router.push(`?${currentParams.toString()}`);
   };

   const handleTabChange = (tab: 'reports' | 'news' | 'blogs') => {
      setActiveTab(tab);
      // Reset page when changing tabs
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('page', '1');
      router.push(`?${currentParams.toString()}`);
   };

   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   const getResultCount = (type: 'reports' | 'news' | 'blogs') => {
      switch (type) {
         case 'reports':
            return data?.report?.length || 0;
         case 'news':
            return data?.['news-article']?.length || 0;
         case 'blogs':
            return data?.blog?.length || 0;
      }
   };

   return (
      <div className='space-y-4 pb-4 md:space-y-6'>
         <div className='flex items-center gap-4'>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${getResultCount('reports') === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('reports')}
               disabled={getResultCount('reports') === 0}
            >
               Reports ({getResultCount('reports')})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'news' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${getResultCount('news') === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('news')}
               disabled={getResultCount('news') === 0}
            >
               News ({getResultCount('news')})
            </button>
            <button
               className={`cursor-pointer rounded-md border border-s-300 px-4 py-2 text-sm ${activeTab === 'blogs' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} ${getResultCount('blogs') === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
               onClick={() => handleTabChange('blogs')}
               disabled={getResultCount('blogs') === 0}
            >
               Blogs ({getResultCount('blogs')})
            </button>
         </div>

         <div>
            {isLoading ? (
               <SkeletonLoader />
            ) : (
               <>
                  {activeTab === 'reports' && (
                     <ReportResults reports={data?.report} />
                  )}
                  {activeTab === 'news' && (
                     <NewsResults news={data?.['news-article']} />
                  )}
                  {activeTab === 'blogs' && (
                     <BlogResults blogs={data?.blog as any} />
                  )}

                  {!hasSearched && (
                     <p className='mt-8 text-center text-gray-500'>
                        Enter a search term to see results
                     </p>
                  )}

                  {hasSearched &&
                     Object.values(data).every((arr) => !arr?.length) && (
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
