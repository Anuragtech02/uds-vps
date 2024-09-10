'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

interface Industry {
   attributes: {
      slug: string;
      name: string;
   };
}

interface ReportStoreFiltersProps {
   industries: Industry[];
   filters: string[];
}

const ReportStoreFilters: React.FC<ReportStoreFiltersProps> = ({
   industries,
   filters,
}) => {
   const router = useRouter();
   const [expanded, setExpanded] = useState(false);

   const handleToggleFilter = (industrySlug: string) => {
      const newFilters = filters.includes(industrySlug)
         ? filters.filter((slug) => slug !== industrySlug)
         : [...filters, industrySlug];

      router.push(`/report-store?filter=${newFilters.join(',')}&page=1`);
   };

   return (
      <div className='relative w-full flex-[0.3] rounded-xl bg-white p-4 md:p-6 lg:sticky lg:top-48 lg:w-max'>
         <h2 className='hidden text-[1.625rem] font-medium lg:block'>
            Reports by industry
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
            {industries.map(({ attributes: { slug, name } }) => (
               <div className='flex items-center gap-4' key={slug}>
                  <input
                     type='checkbox'
                     id={name}
                     checked={filters?.includes(slug)}
                     onChange={() => handleToggleFilter(slug)}
                  />
                  <label htmlFor={name} className='block cursor-pointer'>
                     {name}
                  </label>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReportStoreFilters;
