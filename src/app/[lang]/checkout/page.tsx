export const runtime = 'edge';
import BillingDetails from '@/components/Checkout/BillingDetails';
import Order from '@/components/Checkout/Order';
import Button from '@/components/commons/Button';

const Checkout = () => {
   return (
      <div className='container pt-40'>
         <div className='mt-5 w-full rounded-xl bg-white p-6'>
            <div className='flex flex-wrap items-center justify-between gap-4 pb-4'>
               <div className='flex w-full justify-between gap-2 sm:w-max'>
                  <p className='text-[1.625rem] font-semibold text-s-800 md:text-[2rem]'>
                     Checkout
                  </p>
                  <select
                     name=''
                     id=''
                     className='rounded-full bg-s-200 px-2 py-1 text-sm font-bold sm:hidden'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
               <div className='flex w-full items-stretch gap-0 sm:w-[auto] sm:gap-4'>
                  <input
                     type='text'
                     className='shrink grow basis-0 bg-gray-50 px-6 text-sm sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                     placeholder='Coupon Code'
                  />

                  <Button
                     variant='secondary'
                     className='shrink grow basis-0 sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                  >
                     Apply Code
                  </Button>

                  <select
                     name=''
                     id=''
                     className='hidden rounded-full bg-s-200 px-4 text-lg font-bold sm:block'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
            </div>
            <div className='mt-5 flex flex-col items-start justify-between lg:flex-row'>
               <div className='w-full flex-[0.55] lg:w-max'>
                  <BillingDetails />
               </div>
               <div className='w-[1px] self-stretch bg-s-400'></div>
               <div className='w-full flex-[0.35] lg:w-max'>
                  <Order />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
