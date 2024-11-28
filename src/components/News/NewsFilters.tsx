'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}

const exclude = ['unknown'];

const NewsFilters = ({
   industries,
   filters,
}: {
   industries: industryItem[];
   filters: string[];
}) => {
   const router = useRouter();

   const [expanded, setExpanded] = useState(false);
   const handleToggleFilter = (industrySlug: string) => {
      const newFilters = filters.includes(industrySlug)
         ? filters.filter((slug) => slug !== industrySlug)
         : [...filters, industrySlug];

      router.push(`/news?filter=${newFilters.join(',')}&page=1`);
   };
   return (
      <div className='relative w-full rounded-xl bg-white p-4 md:px-6'>
         <h2 className='hidden text-[1.625rem] font-medium lg:block'>
            News by industry
         </h2>
         <div className='flex items-center justify-between gap-4 lg:hidden'>
            <h2 className='text-[1.25rem] font-medium'>Filters</h2>
            <span className='text-2xl' onClick={() => setExpanded(!expanded)}>
               {expanded ? <BiChevronUp /> : <BiChevronDown />}
            </span>
         </div>
         <div
            className={`${expanded ? 'absolute left-0 z-10 mt-4 h-max overflow-auto rounded-b-xl bg-white px-4 pb-4 shadow-md' : 'mt-0 h-0 overflow-hidden lg:mt-4 lg:h-max lg:overflow-auto'} max-h-[50vh] w-full space-y-4 overflow-y-auto`}
         >
            {industries?.length > 0 ? (
               industries
                  .filter(
                     (industry) =>
                        !exclude.includes(industry.name.toLowerCase()),
                  )
                  .map((industry) => (
                     <div
                        className='flex items-center gap-4'
                        key={industry?.id}
                     >
                        <input
                           type='checkbox'
                           id={industry?.name}
                           checked={filters?.includes(industry?.slug)}
                           onChange={() => handleToggleFilter(industry?.slug)}
                        />
                        <label
                           key={industry?.id}
                           htmlFor={industry?.name}
                           className='block cursor-pointer'
                        >
                           {industry?.name}
                        </label>
                     </div>
                  ))
            ) : (
               <p className='text-md p-4 font-bold text-gray-600'>
                  No Filters found
               </p>
            )}
         </div>
      </div>
   );
};

export default NewsFilters;
