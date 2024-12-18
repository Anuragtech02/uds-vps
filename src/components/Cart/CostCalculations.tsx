import { FC } from 'react';
import { FaTruck } from 'react-icons/fa6';

interface CostCalculationsProps {
   cost: number;
   city: string;
   currency: {
      symbol: string;
      name: string;
   };
}

const CostCalculations: FC<CostCalculationsProps> = ({ cost, city, currency }) => {
   return (
      <>
         <div className='flex justify-between border-b border-s-500 pb-4 font-semibold text-s-600 md:text-lg'>
            <p>Subtotal</p>
            <p className='text-lg md:text-2xl'>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.name }).format(cost)}
            </p>
         </div>
         <div className='flex justify-between border-b border-s-500 pb-4 pt-4 font-semibold text-s-600 md:text-lg'>
            <p>Tax</p>
            <p className='text-md md:text-lg'>Available on payment screen</p>
         </div>
         <div className='flex items-center justify-between pt-4 font-semibold text-s-600 md:text-lg'>
            <p className='font-bold md:text-2xl'>Total</p>
            <p className='text-lg md:text-2xl'>
               {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.name }).format(cost)}
            </p>
         </div>
      </>
   );
};

export default CostCalculations;