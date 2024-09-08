'use client';
import { useEffect, useState } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';
import { searchContent } from '@/utils/api/csr-services';
import { useParams } from 'next/navigation';

const SearchResults = () => {
   const [activeTab, setActiveTab] = useState<'reports' | 'news' | 'blogs'>(
      'reports',
   );
   const [isLoading, setIsLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);
   const [data, setData] = useState<any>({});
   const fetchSuggestions = async () => {
      setIsLoading(true);
      setHasSearched(true);
      const url = new URL(window.location.href);
      const searchQuery = url.searchParams.get('q') || '';
      try {
         const data = await searchContent(encodeURIComponent(searchQuery));
         setData(data.results);
         console.log(data.results);
      } catch (error) {
         console.error('Error fetching suggestions:', error);
         setData({});
      } finally {
         setIsLoading(false);
      }
   };
   useEffect(() => {
      fetchSuggestions();
   }, []);
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
            {activeTab === 'reports' && (
               <ReportResults reports={data?.report} />
            )}
            {activeTab === 'news' && (
               <NewsResults news={data?.['news-article']} />
            )}
            {activeTab === 'blogs' && <BlogResults blogs={data?.blog} />}
         </div>
      </div>
   );
};

export default SearchResults;
