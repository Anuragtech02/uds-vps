import { FC } from 'react';
import { FaTruck } from 'react-icons/fa6';

interface CostCalculationsProps {
   cost: number;
   city: string;
}

const CostCalculations: FC<CostCalculationsProps> = ({ cost, city }) => {
   const tax = cost * 0.18;
   return (
      <>
         <div className='flex justify-between border-b border-s-500 pb-4 font-semibold text-s-600 md:text-lg'>
            <p>Subtotal</p>
            <p>${cost}</p>
         </div>
         <div className='flex justify-between border-b border-s-500 pb-4 pt-4 font-semibold text-s-600 md:text-lg'>
            <p className='text-gray-500'>Shipping</p>
            <div className='text-right text-base'>
               <p>Free shipping</p>
               <p>Shipping to {city}</p>
               <p className='flex cursor-pointer items-center gap-1 text-blue-5'>
                  Change address{' '}
                  <span className='text-xl'>
                     <FaTruck />
                  </span>
               </p>
            </div>
         </div>
         <div className='flex justify-between border-b border-s-500 pb-4 pt-4 font-semibold text-s-600 md:text-lg'>
            <p>Tax</p>
            <p>${tax}</p>
         </div>
         <div className='flex items-center justify-between pt-4 font-semibold text-s-600 md:text-lg'>
            <p className='font-bold md:text-2xl'>Total</p>
            <p className='font-semibold'>${cost + tax}</p>
         </div>
      </>
   );
};

export default CostCalculations;
