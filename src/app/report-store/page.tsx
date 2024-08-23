import ReportStoreItem from '@/components/ReportStore/ReportItem';
import ReportStoreFilters from '@/components/ReportStore/ReportStoreFilters';

const ReportStore = () => {
   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center'>Report Store</h1>
         <div className='my-10 flex items-start gap-6'>
            <ReportStoreFilters />
            <div className='flex-[0.7] space-y-6'>
               {Array.from({ length: 10 }).map((_, i) => (
                  <ReportStoreItem
                     key={i}
                     title='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
                     date='12th June 2021'
                     description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates. amet consectetur adipisicing elit. Quisquam, voluptates.'
                     priceRange='$2000-$5000'
                     sku='SKU-123456'
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default ReportStore;
