'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSliders } from 'react-icons/fi'; // or use FaFilter from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';

interface FilterItem {
   attributes: {
      slug: string;
      name: string;
   };
}

interface FilterBarProps {
   industries: FilterItem[];
   geographies: FilterItem[];
   currentFilters: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
   industries,
   geographies,
   currentFilters,
}) => {
   const router = useRouter();
   const [industryDropdown, setIndustryDropdown] = useState(false);
   const [geographyDropdown, setGeographyDropdown] = useState(false);
   const industryRef = useRef<HTMLDivElement>(null);
   const geographyRef = useRef<HTMLDivElement>(null);

   // Handle click outside to close dropdowns
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            industryRef.current &&
            !industryRef.current.contains(event.target as Node)
         ) {
            setIndustryDropdown(false);
         }
         if (
            geographyRef.current &&
            !geographyRef.current.contains(event.target as Node)
         ) {
            setGeographyDropdown(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleToggleFilter = (
      slug: string,
      type: 'industry' | 'geography',
   ) => {
      const currentParams = new URLSearchParams(window.location.search);
      const industryFilters =
         currentParams.get('industries')?.split(',').filter(Boolean) || [];
      const geographyFilters =
         currentParams.get('geographies')?.split(',').filter(Boolean) || [];

      let updatedParams: Record<string, string> = {
         page: '1',
      };

      if (type === 'industry') {
         const updatedIndustries = industryFilters.includes(slug)
            ? industryFilters.filter((item) => item !== slug)
            : [...industryFilters, slug];
         if (updatedIndustries.length)
            updatedParams.industries = updatedIndustries.join(',');
         if (geographyFilters.length)
            updatedParams.geographies = geographyFilters.join(',');
      } else {
         const updatedGeographies = geographyFilters.includes(slug)
            ? geographyFilters.filter((item) => item !== slug)
            : [...geographyFilters, slug];
         if (industryFilters.length)
            updatedParams.industries = industryFilters.join(',');
         if (updatedGeographies.length)
            updatedParams.geographies = updatedGeographies.join(',');
      }

      router.push(`/reports?${new URLSearchParams(updatedParams).toString()}`);
   };

   const removeFilter = (slug: string) => {
      const currentParams = new URLSearchParams(window.location.search);
      const industryFilters =
         currentParams.get('industries')?.split(',').filter(Boolean) || [];
      const geographyFilters =
         currentParams.get('geographies')?.split(',').filter(Boolean) || [];

      const updatedParams: Record<string, string> = {
         page: '1',
      };

      if (industryFilters.includes(slug)) {
         const updated = industryFilters.filter((item) => item !== slug);
         if (updated.length) updatedParams.industries = updated.join(',');
         if (geographyFilters.length)
            updatedParams.geographies = geographyFilters.join(',');
      } else if (geographyFilters.includes(slug)) {
         const updated = geographyFilters.filter((item) => item !== slug);
         if (industryFilters.length)
            updatedParams.industries = industryFilters.join(',');
         if (updated.length) updatedParams.geographies = updated.join(',');
      }

      router.push(`/reports?${new URLSearchParams(updatedParams).toString()}`);
   };

   const getFilterName = (slug: string) => {
      const industry = industries.find((item) => item.attributes.slug === slug);
      if (industry) return industry.attributes.name;
      const geography = geographies.find(
         (item) => item.attributes.slug === slug,
      );
      if (geography) return geography.attributes.name;
      return slug;
   };

   return (
      <div className='sticky top-40 z-30 mt-10 rounded-lg bg-white py-4 shadow-sm'>
         <div className='container flex flex-col items-start gap-6 lg:flex-row lg:items-center'>
            {/* Added Filter Label */}
            <div className='flex items-center gap-2 text-gray-600'>
               <FiSliders className='h-5 w-5' />
               <span className='font-medium'>Filter Reports By:</span>
            </div>

            <div className='flex flex-wrap items-center gap-4'>
               {/* Industry Filter */}
               <div className='relative' ref={industryRef}>
                  <button
                     onClick={() => {
                        setIndustryDropdown(!industryDropdown);
                        setGeographyDropdown(false);
                     }}
                     className='flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                     Industry <BiChevronDown className='h-5 w-5' />
                  </button>
                  {industryDropdown && (
                     <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-4 shadow-lg'>
                        {industries.map(({ attributes: { slug, name } }) => (
                           <div
                              key={slug}
                              className='flex items-center gap-3 py-2'
                           >
                              <input
                                 type='checkbox'
                                 id={`industry-${slug}`}
                                 checked={currentFilters.includes(slug)}
                                 onChange={() =>
                                    handleToggleFilter(slug, 'industry')
                                 }
                                 className='rounded'
                              />
                              <label
                                 htmlFor={`industry-${slug}`}
                                 className='cursor-pointer'
                              >
                                 {name}
                              </label>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Geography Filter */}
               <div className='relative' ref={geographyRef}>
                  <button
                     onClick={() => {
                        setGeographyDropdown(!geographyDropdown);
                        setIndustryDropdown(false);
                     }}
                     className='flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                     Geography <BiChevronDown className='h-5 w-5' />
                  </button>
                  {geographyDropdown && (
                     <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-4 shadow-lg'>
                        {geographies.map(({ attributes: { slug, name } }) => (
                           <div
                              key={slug}
                              className='flex items-center gap-3 py-2'
                           >
                              <input
                                 type='checkbox'
                                 id={`geography-${slug}`}
                                 checked={currentFilters.includes(slug)}
                                 onChange={() =>
                                    handleToggleFilter(slug, 'geography')
                                 }
                                 className='rounded'
                              />
                              <label
                                 htmlFor={`geography-${slug}`}
                                 className='cursor-pointer'
                              >
                                 {name}
                              </label>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Selected Filters */}
               {currentFilters.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                     {currentFilters.map((filter) => (
                        <span
                           key={filter}
                           className='flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600'
                        >
                           {getFilterName(filter)}
                           <IoCloseOutline
                              className='h-4 w-4 cursor-pointer hover:text-blue-800'
                              onClick={() => removeFilter(filter)}
                           />
                        </span>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default FilterBar;
