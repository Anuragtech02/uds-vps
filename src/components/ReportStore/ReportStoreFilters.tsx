'use client';

const ReportStoreFilters = ({ industries, filters }) => {
   const handleToggleFilter = (industrySlug: string) => {
      const newFilter = filters
         ? filters?.includes(industrySlug)
            ? filters?.filter((slug) => slug !== industrySlug)
            : [...filters, industrySlug]
         : [industrySlug];
      window.location.href = `/report-store?filter=${newFilter?.join(',')}&page=1`;
   };
   return (
      <div className='sticky top-48 flex-[0.3] space-y-4 rounded-xl bg-white p-6'>
         <h2 className='text-[1.625rem] font-medium'>Reports by industry</h2>

         <div className={'mt-2 space-y-4'}>
            {industries.map((industry) => (
               <div
                  className='flex items-center gap-4'
                  key={industry?.attributes?.slug}
               >
                  <input
                     type='checkbox'
                     id={industry?.attributes?.name}
                     checked={filters?.includes(industry?.attributes?.slug)}
                     onChange={() => {
                        handleToggleFilter(industry?.attributes?.slug);
                     }}
                  />
                  <label
                     key={industry?.attributes?.slug}
                     htmlFor={industry?.attributes?.name}
                     className='block cursor-pointer'
                  >
                     {industry?.attributes?.name}
                  </label>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReportStoreFilters;
