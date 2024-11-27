import { IoMdCloseCircle } from 'react-icons/io';
import Link from 'next/link';
import { LocalizedLink } from '@/components/commons/LocalizedLink';

export default function PaymentFailure() {
   return (
      <div className='flex min-h-screen flex-col items-center justify-center py-20'>
         <div className='rounded-lg bg-white p-8 shadow-md'>
            <div className='flex flex-col items-center justify-center text-center'>
               <IoMdCloseCircle className='mb-4 text-6xl text-red-500' />
               <h1 className='mb-4 text-3xl font-bold'>Payment Failed</h1>
               <p className='mb-8 text-gray-600'>
                  Sorry, we couldn&apos;t process your payment. Please try again
                  later.
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
}
