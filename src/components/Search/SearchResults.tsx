'use client';
import { useEffect, useState } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';
import { searchContent } from '@/utils/api/csr-services';
import { useRouter, useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

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
   const [data, setData] = useState<any>({});
   const [currentPage, setCurrentPage] = useState(1);
   const [totalItems, setTotalItems] = useState(0);

   const router = useRouter();
   const searchParams = useSearchParams();

   const fetchResults = async (page: number) => {
      setIsLoading(true);
      setHasSearched(true);
      const searchQuery = searchParams.get('q') || '';
      try {
         const data = await searchContent(
            encodeURIComponent(searchQuery),
            page,
            ITEMS_PER_PAGE,
         );
         setData(data.results);
         setTotalItems(data.total);
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
   }, [searchParams]);

   const handlePageChange = (newPage: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('page', newPage.toString());
      router.push(`?${currentParams.toString()}`);
   };

   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div className='space-y-4 md:space-y-6'>
         <div className='flex items-center gap-4'>
            <div
               className={`cursor-pointer border border-s-300 ${
                  activeTab === 'reports' ? 'bg-blue-9' : ''
               } rounded-md px-4 py-2 text-sm`}
               onClick={() => setActiveTab('reports')}
            >
               Reports
            </div>
            <div
               className={`cursor-pointer border border-s-300 ${
                  activeTab === 'news' ? 'bg-blue-9' : ''
               } rounded-md px-4 py-2 text-sm`}
               onClick={() => setActiveTab('news')}
            >
               News
            </div>
            <div
               className={`cursor-pointer border border-s-300 ${
                  activeTab === 'blogs' ? 'bg-blue-9' : ''
               } rounded-md px-4 py-2 text-sm`}
               onClick={() => setActiveTab('blogs')}
            >
               Blogs
            </div>
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
                  {activeTab === 'blogs' && <BlogResults blogs={data?.blog} />}
               </>
            )}
         </div>
         {!isLoading && totalPages > 1 && (
            <div className='mt-4 flex items-center justify-center space-x-2'>
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='rounded-md border px-4 py-2 disabled:opacity-50'
               >
                  Previous
               </button>
               <span>
                  {currentPage} of {totalPages}
               </span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='rounded-md border px-4 py-2 disabled:opacity-50'
               >
                  Next
               </button>
            </div>
         )}
      </div>
   );
};

export default SearchResults;
