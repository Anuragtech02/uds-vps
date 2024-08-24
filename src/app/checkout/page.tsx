import BillingDetails from '@/components/Checkout/BillingDetails';
import Order from '@/components/Checkout/Order';
import Button from '@/components/commons/Button';

const Checkout = () => {
   return (
      <div className='container pt-40'>
         <div className='mt-5 w-full rounded-xl bg-white p-6'>
            <div className='flex items-center justify-between'>
               <p className='text-[2rem] font-semibold text-s-800'>Checkout</p>
               <div className='flex items-stretch gap-4'>
                  <input
                     type='text'
                     className='bg-gray-50 px-6 text-sm'
                     placeholder='Coupon Code'
                  />

                  <Button variant='secondary'>Apply Code</Button>

                  <select
                     name=''
                     id=''
                     className='rounded-full bg-s-200 px-4 text-lg font-bold'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
            </div>
            <div className='mt-5 flex items-start justify-between'>
               <div className='flex-[0.55]'>
                  <BillingDetails />
               </div>
               <div className='w-[1px] self-stretch bg-s-400'></div>
               <div className='flex-[0.35]'>
                  <Order />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
