import { FC } from 'react';

interface CostCalculationsProps {
   cost: number;
   city: string;
   country: string;
   currency: {
      symbol: string;
      name: string;
   };
   totalDiscounts: number;
   discountPercentages: Array<number>;
}

const CostCalculations: FC<CostCalculationsProps> = ({
   cost,
   city,
   country,
   currency,
   totalDiscounts,
   discountPercentages,
}) => {
   const subtotal = cost - totalDiscounts;
   const taxRate = country === 'IND' ? 0.18 : 0;
   const taxAmount = subtotal * taxRate;
   const finalCost = subtotal + taxAmount;

   return (
      <>
         <div className='flex justify-between border-b border-s-500 pb-4 font-semibold text-s-600 md:text-lg'>
            <p>Subtotal</p>
            <p className='text-lg md:text-2xl'>
               {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.name,
               }).format(cost)}
            </p>
         </div>
         <div className='flex justify-between border-b border-s-500 pb-4 pt-4 font-semibold text-s-600 md:text-lg'>
            <p>
               Discount (
               {discountPercentages?.length > 1
                  ? discountPercentages?.join('%, ')
                  : discountPercentages[0]}
               % )
            </p>
            <p className='text-md text-green-600 md:text-lg'>
               -
               {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.name,
               }).format(totalDiscounts)}
            </p>
         </div>
         {taxRate > 0 && (
            <div className='flex justify-between border-b border-s-500 pb-4 pt-4 font-semibold text-s-600 md:text-lg'>
               <p>GST (18%)</p>
               <p className='text-md md:text-lg'>
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: currency.name,
                  }).format(taxAmount)}
               </p>
            </div>
         )}
         <div className='flex items-center justify-between pt-4 font-semibold text-s-600 md:text-lg'>
            <p className='font-bold md:text-2xl'>Total</p>
            <p className='text-lg md:text-2xl'>
               {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.name,
               }).format(finalCost)}
            </p>
         </div>
      </>
   );
};

export default CostCalculations;
