'use client';
import { useState } from 'react';
import ReportResults from './ReportResults';
import NewsResults from './NewsResults';
import BlogResults from './BlogResults';

const SearchResults = () => {
   const [activeTab, setActiveTab] = useState<'reports' | 'news' | 'blogs'>(
      'reports',
   );
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
            {activeTab === 'reports' && <ReportResults />}
            {activeTab === 'news' && <NewsResults />}
            {activeTab === 'blogs' && <BlogResults />}
         </div>
      </div>
   );
};

export default SearchResults;
