import industries from '@/utils/industries.json';

const NewsFilters = () => {
   return (
      <div className='sticky top-48 flex-[0.3] rounded-xl bg-white p-6'>
         <h2 className='text-[1.625rem] font-medium'>News by industry</h2>
         <div className='mt-2 space-y-4'>
            {industries.map((industry) => (
               <div className='flex items-center gap-4' key={industry}>
                  <input type='checkbox' id={industry} />
                  <label
                     key={industry}
                     htmlFor={industry}
                     className='block cursor-pointer'
                  >
                     {industry}
                  </label>
               </div>
            ))}
         </div>
      </div>
   );
};

export default NewsFilters;
