// import industries from '@/utils/industries.json';
interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}
const NewsFilters = ({ industries }: { industries: industryItem[] }) => {
   return (
      <div className='sticky top-48 flex-[0.3] rounded-xl bg-white p-6'>
         <h2 className='text-[1.625rem] font-medium'>News by industry</h2>
         <div className='mt-2 space-y-4'>
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

export default NewsFilters;
