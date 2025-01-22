'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSliders } from 'react-icons/fi';
import { BiChevronDown } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';

interface FilterItem {
   attributes: {
      slug: string;
      name: string;
   };
}

interface SearchFilterBarProps {
   industries: { data: FilterItem[] };
   geographies: { data: FilterItem[] };
   currentFilters: string[];
   searchQuery?: string;
   sortBy?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
   industries,
   geographies,
   currentFilters,
   searchQuery,
   sortBy,
}) => {
   const router = useRouter();
   const [industryDropdown, setIndustryDropdown] = useState(false);
   const [geographyDropdown, setGeographyDropdown] = useState(false);
   const [sortDropdown, setSortDropdown] = useState(false);

   const industryRef = useRef<HTMLDivElement>(null);
   const geographyRef = useRef<HTMLDivElement>(null);
   const sortRef = useRef<HTMLDivElement>(null);

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
         if (
            sortRef.current &&
            !sortRef.current.contains(event.target as Node)
         ) {
            setSortDropdown(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const updateSearchParams = (updates: Record<string, string>) => {
      const currentParams = new URLSearchParams(window.location.search);
      const newParams: Record<string, string> = {
         q: searchQuery || '',
         page: '1',
         ...updates,
      };

      // Remove empty params
      Object.entries(newParams).forEach(([key, value]) => {
         if (!value) delete newParams[key];
      });

      router.push(`/search?${new URLSearchParams(newParams).toString()}`);
   };

   const handleToggleFilter = (
      slug: string,
      type: 'industry' | 'geography',
   ) => {
      const currentParams = new URLSearchParams(window.location.search);
      const industryFilters =
         currentParams.get('industries')?.split(',').filter(Boolean) || [];
      const geographyFilters =
         currentParams.get('geographies')?.split(',').filter(Boolean) || [];

      if (type === 'industry') {
         const updatedIndustries = industryFilters.includes(slug)
            ? industryFilters.filter((item) => item !== slug)
            : [...industryFilters, slug];

         updateSearchParams({
            industries: updatedIndustries.join(','),
            geographies: geographyFilters.join(','),
         });
      } else {
         const updatedGeographies = geographyFilters.includes(slug)
            ? geographyFilters.filter((item) => item !== slug)
            : [...geographyFilters, slug];

         updateSearchParams({
            industries: industryFilters.join(','),
            geographies: updatedGeographies.join(','),
         });
      }
   };

   const handleSort = (value: string) => {
      updateSearchParams({ sortBy: value });
      setSortDropdown(false);
   };

   const removeFilter = (slug: string) => {
      const currentParams = new URLSearchParams(window.location.search);
      const industryFilters =
         currentParams.get('industries')?.split(',').filter(Boolean) || [];
      const geographyFilters =
         currentParams.get('geographies')?.split(',').filter(Boolean) || [];

      if (industryFilters.includes(slug)) {
         updateSearchParams({
            industries: industryFilters
               .filter((item) => item !== slug)
               .join(','),
            geographies: geographyFilters.join(','),
         });
      } else if (geographyFilters.includes(slug)) {
         updateSearchParams({
            industries: industryFilters.join(','),
            geographies: geographyFilters
               .filter((item) => item !== slug)
               .join(','),
         });
      }
   };

   const getFilterName = (slug: string) => {
      const industry = industries?.data.find(
         (item) => item.attributes.slug === slug,
      );
      if (industry) return industry.attributes.name;
      const geography = geographies?.data.find(
         (item) => item.attributes.slug === slug,
      );
      if (geography) return geography.attributes.name;
      return slug;
   };

   console.log({ industries, geographies });

   return (
      <div className='sticky top-44 z-30 mb-6 rounded-lg bg-white py-4 shadow-sm'>
         <div className='container flex flex-col items-start gap-6 lg:flex-row lg:items-center'>
            <div className='flex items-center gap-2 text-gray-600'>
               <FiSliders className='h-5 w-5' />
               <span className='font-medium'>Filter Results By:</span>
            </div>

            <div className='flex flex-wrap items-center gap-4'>
               {/* Industry Filter */}
               <div className='relative' ref={industryRef}>
                  <button
                     onClick={() => {
                        setIndustryDropdown(!industryDropdown);
                        setGeographyDropdown(false);
                        setSortDropdown(false);
                     }}
                     className='flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                     Industry <BiChevronDown className='h-5 w-5' />
                  </button>
                  {industryDropdown && (
                     <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-4 shadow-lg'>
                        {industries?.data.map(
                           ({ attributes: { slug, name } }) => (
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
                           ),
                        )}
                     </div>
                  )}
               </div>

               {/* Geography Filter */}
               <div className='relative' ref={geographyRef}>
                  <button
                     onClick={() => {
                        setGeographyDropdown(!geographyDropdown);
                        setIndustryDropdown(false);
                        setSortDropdown(false);
                     }}
                     className='flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                     Geography <BiChevronDown className='h-5 w-5' />
                  </button>
                  {geographyDropdown && (
                     <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg bg-white p-4 shadow-lg'>
                        {geographies?.data.map(
                           ({ attributes: { slug, name } }) => (
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
                           ),
                        )}
                     </div>
                  )}
               </div>

               {/* Sort Dropdown */}
               <div className='relative' ref={sortRef}>
                  <button
                     onClick={() => {
                        setSortDropdown(!sortDropdown);
                        setIndustryDropdown(false);
                        setGeographyDropdown(false);
                     }}
                     className='flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                     Sort By <BiChevronDown className='h-5 w-5' />
                  </button>
                  {sortDropdown && (
                     <div className='absolute top-full mt-2 w-48 rounded-lg bg-white p-2 shadow-lg'>
                        {[
                           { value: 'relevance', label: 'Most Relevant' },
                           {
                              value: 'oldPublishedAt:desc',
                              label: 'Newest First',
                           },
                           {
                              value: 'oldPublishedAt:asc',
                              label: 'Oldest First',
                           },
                        ].map((option) => (
                           <button
                              key={option.value}
                              onClick={() => handleSort(option.value)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                                 sortBy === option.value
                                    ? 'bg-blue-50 text-blue-600'
                                    : ''
                              }`}
                           >
                              {option.label}
                           </button>
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

export default SearchFilterBar;
