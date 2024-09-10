'use client';
import { useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

// import industries from '@/utils/industries.json';
interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}

const BlogFilters = ({ industries }: { industries: industryItem[] }) => {
   const [expanded, setExpanded] = useState(false);
   return (
      <div className='relative w-full flex-[0.3] rounded-xl bg-white p-4 md:p-6 lg:sticky lg:top-48 lg:w-max'>
         <h2 className='hidden text-[1.625rem] font-medium lg:block'>
            Blogs by industry
         </h2>
         <div className='flex items-center justify-between gap-4 lg:hidden'>
            <h2 className='text-[1.25rem] font-medium'>Filters</h2>
            <span className='text-2xl' onClick={() => setExpanded(!expanded)}>
               {expanded ? <BiChevronUp /> : <BiChevronDown />}
            </span>
         </div>
         <div
            className={`${expanded ? 'absolute left-0 z-10 mt-4 h-max overflow-auto rounded-b-xl bg-white px-4 pb-4 shadow-md' : 'mt-0 h-0 overflow-hidden md:mt-4 lg:h-max lg:overflow-auto'} w-full space-y-4`}
         >
            {industries.map((industry) => (
               <div className='flex items-center gap-4' key={industry?.id}>
                  <input type='checkbox' id={industry?.name} />
                  <label
                     key={industry?.id}
                     htmlFor={industry?.name}
                     className='block cursor-pointer'
                  >
                     {industry?.name}
                  </label>
               </div>
            ))}
         </div>
      </div>
   );
};

export default BlogFilters;
