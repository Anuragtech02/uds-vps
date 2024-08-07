import placeholderImage from '@/assets/img/sampleResearch.png';
import Button from '../commons/Button';

const Header = () => {
   return (
      <div className='w-full bg-white py-4'>
         <div className='container'>
            <div className='flex gap-4'>
               <div className='rounded-md'>
                  <img
                     className='h-[200px] w-full object-cover'
                     src={placeholderImage.src}
                     alt='report'
                  />
               </div>
               <div className='flex flex-col justify-center gap-4 font-semibold'>
                  <div className='flex items-start justify-between gap-6'>
                     <h3 className='w-2/3 font-bold'>
                        Asia Pacific Battery Recycling Market: Current Analysis
                        and Forecast (2024-2032)
                     </h3>
                     <div className='rounded-full bg-s-200 px-8 py-4 md:text-2xl'>
                        <p className='text-blue-3'>$3999-$5999</p>
                     </div>
                  </div>
                  <div className='flex items-center gap-2'>
                     <p className='text-lg text-s-500'>Categories:</p>
                     <p className='text-xl text-blue-4'>
                        Energy and Power, Industry Reports
                     </p>
                  </div>
                  <div className='flex items-end justify-between'>
                     <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-4'>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>Page:</p>
                              <p className='text-xl text-blue-4'>65</p>
                           </div>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>Table:</p>
                              <p className='text-xl text-blue-4'>65</p>
                           </div>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>Figure:</p>
                              <p className='text-xl text-blue-4'>65</p>
                           </div>
                        </div>
                        <div className='flex items-center gap-2'>
                           <p className='text-lg text-s-500'>Geography:</p>
                           <p className='text-xl text-blue-4'>Asia-Pacific</p>
                        </div>
                        <div className='flex items-center gap-2'>
                           <p className='text-lg text-s-500'>
                              Report ID & SKU:
                           </p>
                           <p className='text-xl text-blue-4'>UMEP212790</p>
                        </div>
                     </div>
                     <div className='flex items-center gap-2'>
                        <Button variant='light'>Download Report</Button>
                        <Button variant='secondary'>Buy Now</Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Header;
