import Link from 'next/link';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const PaymentSuccess = () => {
   return (
      <div className='flex min-h-screen flex-col items-center justify-center py-20'>
         <div className='rounded-lg bg-white p-8 shadow-md'>
            <div className='flex flex-col items-center justify-center text-center'>
               <IoMdCheckmarkCircle className='mb-4 text-6xl text-green-500' />
               <h1 className='mb-4 text-3xl font-bold'>
                  Your payment was successful
               </h1>
               <p className='mb-8 text-gray-600'>
                  Thank you for your purchase. We will send you an email with
                  the details of your order.
               </p>
               <LocalizedLink href='/'>
                  <button className='rounded-full bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'>
                     Go back to home
                  </button>
               </LocalizedLink>
            </div>
         </div>
      </div>
   );
};

export default PaymentSuccess;
