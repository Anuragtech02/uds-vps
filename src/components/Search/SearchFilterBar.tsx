'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSliders } from 'react-icons/fi';
import { BiChevronDown } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

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
   locale?: string;
}

// Helper function to check if geography filter should be shown
const shouldShowGeography = (activeTab: string | null): boolean => {
   // Show geography filter only for reports tab or when no specific tab is selected
   return !activeTab || activeTab === 'reports';
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
   industries,
   geographies,
   currentFilters,
   searchQuery,
   sortBy,
   locale = 'en',
}) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [industryDropdown, setIndustryDropdown] = useState(false);
   const [geographyDropdown, setGeographyDropdown] = useState(false);
   const [sortDropdown, setSortDropdown] = useState(false);

   const industryRef = useRef<HTMLDivElement>(null);
   const geographyRef = useRef<HTMLDivElement>(null);
   const sortRef = useRef<HTMLDivElement>(null);

   // Get the current active tab from URL
   const activeTab = searchParams.get('tab');

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

   // Close geography dropdown when switching away from reports tab
   useEffect(() => {
      if (!shouldShowGeography(activeTab)) {
         setGeographyDropdown(false);
      }
   }, [activeTab]);

   const updateSearchParams = (updates: Record<string, string>) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
         if (value) {
            currentParams.set(key, value);
         } else {
            currentParams.delete(key);
         }
      });

      // Reset to page 1 when filters change
      currentParams.set('page', '1');

      // If switching away from reports tab, clear geography filters
      if (updates.tab && updates.tab !== 'reports') {
         currentParams.delete('geographies');
      }

      const queryString = currentParams.toString();
      const basePath = locale === 'en' ? '' : `/${locale}`;
      router.push(`${basePath}/search?${queryString}`);
   };

   const handleToggleFilter = (
      slug: string,
      type: 'industry' | 'geography',
   ) => {
      const currentParams = new URLSearchParams(searchParams.toString());
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
         // Only allow geography filtering if it's supported for current tab
         if (!shouldShowGeography(activeTab)) {
            console.warn(
               'Geography filtering not supported for current tab:',
               activeTab,
            );
            return;
         }

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
      const currentParams = new URLSearchParams(searchParams.toString());
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

   // Get current filter counts for display
   const currentParams = new URLSearchParams(searchParams.toString());
   const activeIndustryFilters =
      currentParams.get('industries')?.split(',').filter(Boolean) || [];
   const activeGeographyFilters =
      currentParams.get('geographies')?.split(',').filter(Boolean) || [];

   return (
      <div className='sticky top-44 z-30 mb-6 rounded-lg bg-white py-4 shadow-sm'>
         <div className='container flex flex-col items-start gap-6 lg:flex-row lg:items-center'>
            <div className='flex items-center gap-2 text-gray-600'>
               <FiSliders className='h-5 w-5' />
               <span className='font-medium'>
                  {TRANSLATED_VALUES[locale]?.commons?.filterResultsBy ||
                     'Filter Results By:'}
               </span>
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
                     className={`flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 ${
                        activeIndustryFilters.length > 0
                           ? 'border-blue-300 bg-blue-50 text-blue-700'
                           : ''
                     }`}
                  >
                     {TRANSLATED_VALUES[locale]?.commons?.industry ||
                        'Industry'}
                     {activeIndustryFilters.length > 0 && (
                        <span className='ml-1 rounded-full bg-blue-200 px-2 py-0.5 text-xs'>
                           {activeIndustryFilters.length}
                        </span>
                     )}
                     <BiChevronDown className='h-5 w-5' />
                  </button>
                  {industryDropdown && (
                     <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg border bg-white p-4 shadow-lg'>
                        <div className='mb-2 text-sm font-medium text-gray-600'>
                           {TRANSLATED_VALUES[locale]?.commons
                              ?.selectIndustries || 'Select Industries'}
                        </div>
                        {industries?.data.map(
                           ({ attributes: { slug, name } }) => (
                              <div
                                 key={slug}
                                 className='flex items-center gap-3 py-2 hover:bg-gray-50'
                              >
                                 <input
                                    type='checkbox'
                                    id={`industry-${slug}`}
                                    checked={activeIndustryFilters.includes(
                                       slug,
                                    )}
                                    onChange={() =>
                                       handleToggleFilter(slug, 'industry')
                                    }
                                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                 />
                                 <label
                                    htmlFor={`industry-${slug}`}
                                    className='flex-1 cursor-pointer text-sm'
                                 >
                                    {TRANSLATED_VALUES[locale]?.industries?.[
                                       name
                                    ] || name}
                                 </label>
                              </div>
                           ),
                        )}
                     </div>
                  )}
               </div>

               {/* Geography Filter - Only show for reports */}
               {shouldShowGeography(activeTab) && (
                  <div className='relative' ref={geographyRef}>
                     <button
                        onClick={() => {
                           setGeographyDropdown(!geographyDropdown);
                           setIndustryDropdown(false);
                           setSortDropdown(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 ${
                           activeGeographyFilters.length > 0
                              ? 'border-blue-300 bg-blue-50 text-blue-700'
                              : ''
                        }`}
                     >
                        {TRANSLATED_VALUES[locale]?.commons?.geography ||
                           'Geography'}
                        {activeGeographyFilters.length > 0 && (
                           <span className='ml-1 rounded-full bg-blue-200 px-2 py-0.5 text-xs'>
                              {activeGeographyFilters.length}
                           </span>
                        )}
                        <BiChevronDown className='h-5 w-5' />
                     </button>
                     {geographyDropdown && (
                        <div className='absolute top-full mt-2 max-h-[60vh] w-64 overflow-y-auto rounded-lg border bg-white p-4 shadow-lg'>
                           <div className='mb-2 text-sm font-medium text-gray-600'>
                              {TRANSLATED_VALUES[locale]?.commons
                                 ?.selectRegions || 'Select Regions'}
                           </div>
                           {geographies?.data
                              .filter(
                                 (item) => item.attributes.slug !== 'unknown',
                              )
                              .map(({ attributes: { slug, name } }) => (
                                 <div
                                    key={slug}
                                    className='flex items-center gap-3 py-2 hover:bg-gray-50'
                                 >
                                    <input
                                       type='checkbox'
                                       id={`geography-${slug}`}
                                       checked={activeGeographyFilters.includes(
                                          slug,
                                       )}
                                       onChange={() =>
                                          handleToggleFilter(slug, 'geography')
                                       }
                                       className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                    />
                                    <label
                                       htmlFor={`geography-${slug}`}
                                       className='flex-1 cursor-pointer text-sm'
                                    >
                                       {name}
                                    </label>
                                 </div>
                              ))}
                        </div>
                     )}
                  </div>
               )}

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
                     {TRANSLATED_VALUES[locale]?.commons?.sortBy || 'Sort By'}
                     <BiChevronDown className='h-5 w-5' />
                  </button>
                  {sortDropdown && (
                     <div className='absolute top-full mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg'>
                        {[
                           {
                              value: 'relevance',
                              label:
                                 TRANSLATED_VALUES[locale]?.commons
                                    ?.mostRelevant || 'Most Relevant',
                           },
                           {
                              value: 'oldPublishedAt:desc',
                              label:
                                 TRANSLATED_VALUES[locale]?.commons
                                    ?.newestFirst || 'Newest First',
                           },
                           {
                              value: 'oldPublishedAt:asc',
                              label:
                                 TRANSLATED_VALUES[locale]?.commons
                                    ?.oldestFirst || 'Oldest First',
                           },
                        ].map((option) => (
                           <button
                              key={option.value}
                              onClick={() => handleSort(option.value)}
                              className={`w-full rounded px-4 py-2 text-left text-sm hover:bg-gray-50 ${
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
                           className='flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600'
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

         {/* Info message when geography filter is hidden */}
         {activeTab && activeTab !== 'reports' && (
            <div className='container mt-2'>
               <div className='rounded bg-gray-50 px-3 py-2 text-xs text-gray-500'>
                  💡{' '}
                  {TRANSLATED_VALUES[locale]?.commons?.geographyOnlyReports ||
                     'Geography filters are only available for Reports. Switch to Reports tab to filter by region.'}
               </div>
            </div>
         )}
      </div>
   );
};

export default SearchFilterBar;
