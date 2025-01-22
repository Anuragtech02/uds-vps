import { FC } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { LocalizedLink } from '../commons/LocalizedLink';

interface CartItemProps {
   name: string;
   price: number;
   img?: string;
   quantity: number;
   selectedLicense: any;
   report: any;
   handleRemoveItem: (id: number) => void;
   handleChangeQuantity: (id: number, quantity: number) => void;
   handleChangeLicense: (id: number, license: any) => void;
   convertPrice: (amount: number) => number;
   selectedCurrency: string;
   currencySymbol: string;
}

const CartItem: FC<CartItemProps> = ({
   report,
   quantity,
   selectedLicense,
   handleRemoveItem,
   handleChangeQuantity,
   handleChangeLicense,
   convertPrice,
   selectedCurrency,
   currencySymbol,
}) => {
   let name = report?.title,
      price = selectedLicense?.price?.amount,
      img =
         report?.highlightImage?.data?.attributes?.url ||
         '/api/placeholder/64/64';
   const formatPrice = (amount: number | undefined) => {
      if (amount === undefined || isNaN(amount)) return `${currencySymbol}0.00`;
      const converted = convertPrice(amount);
      return new Intl.NumberFormat(selectedCurrency, {
         style: 'currency',
         currency: selectedCurrency,
      }).format(converted);
   };

   return (
      <div className='mt-2 flex flex-col items-center gap-4 border-gray-200 py-4 first:pt-0 last:border-0 last:pb-0 sm:flex-row'>
         {/* Left section with delete, image, and title */}
         <div className='flex w-full items-center gap-4 sm:w-2/5'>
            <button
               title='Remove item'
               onClick={() => handleRemoveItem(report?.id)}
               className='text-gray-500 transition-colors hover:text-gray-700'
            >
               <IoCloseCircle className='h-5 w-5' />
            </button>

            <img
               src={img}
               alt={name}
               className='h-16 w-16 rounded border border-gray-300 object-cover'
            />

            <h5 className='line-clamp-2 flex-1 font-medium text-gray-900'>
               <LocalizedLink
                  href={`/reports/${report?.slug}`}
                  className='hover:underline'
               >
                  {name}
               </LocalizedLink>
            </h5>
         </div>

         {/* Middle section with license selection */}
         <div className='relative w-full sm:w-2/5'>
            <div className='flex items-center gap-2'>
               <select
                  aria-label='Select license type'
                  value={selectedLicense?.title}
                  onChange={(e) => {
                     const newLicense = report.variants.find(
                        (variant: any) => variant.title === e.target.value,
                     );
                     handleChangeLicense(report.id, newLicense);
                  }}
                  className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
               >
                  {report.variants?.map((variant: any) => (
                     <option key={variant?.id} value={variant?.title}>
                        {variant?.title} - {formatPrice(variant?.price?.amount)}
                     </option>
                  ))}
               </select>
               <div className='group relative'>
                  <svg
                     className='h-5 w-5 cursor-help text-gray-500'
                     fill='none'
                     viewBox='0 0 24 24'
                     stroke='currentColor'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                     />
                  </svg>
                  <div className='invisible absolute bottom-full left-1/2 z-10 w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-2 text-sm text-white shadow-lg group-hover:visible'>
                     <div
                        dangerouslySetInnerHTML={{
                           __html:
                              selectedLicense?.description ||
                              'No description available',
                        }}
                     />
                     <div className='absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900'></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right section with price and subtotal */}
         <div className='flex w-full items-center justify-end gap-8 sm:w-2/5'>
            <div className='font-medium text-gray-900'>
               {formatPrice(price)}
            </div>

            {/* <div className="text-gray-900 font-medium text-right min-w-[80px]">
               {formatPrice(price * quantity)}
            </div> */}
         </div>
      </div>
   );
};

export default CartItem;
