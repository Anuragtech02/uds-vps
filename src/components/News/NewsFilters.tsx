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

interface NewsFiltersProps {
   industries: Industry[];
   filters: string[];
}

const exclude = ['unknown'];

const NewsFilters: React.FC<NewsFiltersProps> = ({
   industries,
   filters,
}) => {
   const router = useRouter();
   const [expanded, setExpanded] = useState(false);

   const handleToggleFilter = (slug: string, type: 'industry' | 'geography' = 'industry') => {
      const currentParams = new URLSearchParams(window.location.search);
      const industryFilters = currentParams.get('industries')?.split(',').filter(Boolean) || [];
      const geographyFilters = currentParams.get('geographies')?.split(',').filter(Boolean) || [];

      let updatedIndustryFilters = [...industryFilters];
      let updatedGeographyFilters = [...geographyFilters];

      if (type === 'industry') {
         updatedIndustryFilters = industryFilters.includes(slug)
            ? industryFilters.filter((item) => item !== slug)
            : [...industryFilters, slug];
      } else {
         updatedGeographyFilters = geographyFilters.includes(slug)
            ? geographyFilters.filter((item) => item !== slug)
            : [...geographyFilters, slug];
      }

      const updatedParams: Record<string, string> = {
         page: currentParams.get('page') || '1',
         industries: updatedIndustryFilters.join(','),
         geographies: updatedGeographyFilters.join(','),
      };

      const searchQuery = currentParams.get('search');
      if (searchQuery) {
         updatedParams.search = searchQuery;
      }

      // Remove empty params
      Object.keys(updatedParams).forEach(key => 
         !updatedParams[key] && delete updatedParams[key]
      );

      router.push(`/news?${new URLSearchParams(updatedParams).toString()}`);
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
            className={`${expanded ? 'absolute left-0 z-10 mt-4 h-max overflow-auto rounded-xl bg-white px-4 pb-4 shadow-md' : 'mt-0 h-0 overflow-hidden lg:mt-4 lg:h-max lg:overflow-auto'} max-h-[50vh] w-full space-y-4 overflow-y-auto`}
         >
            {industries
               .filter(
                  (industry) =>
                     !exclude.includes(industry.attributes.name.toLowerCase()),
               )
               .map(({ attributes: { slug, name } }) => (
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

export default NewsFilters;
