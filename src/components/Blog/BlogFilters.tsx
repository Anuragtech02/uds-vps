import industries from '@/utils/industries.json';

const BlogFilters = () => {
   return (
      <div className='flex-[0.3] bg-white'>
         <h4>Blogs by industry</h4>
         <div className='space-y-4'>
            {industries.map((industry) => (
               <div className='flex items-center gap-4' key={industry}>
                  <label key={industry} className='block'>
                     {industry}
                  </label>
                  <input type='checkbox' />
               </div>
            ))}
         </div>
      </div>
   );
};

export default BlogFilters;
