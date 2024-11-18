import reportPlaceholder from '@/assets/img/sampleResearch.png';
import { FC } from 'react';
import { FaCircleMinus, FaCirclePlus } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';

interface CheckoutOrderItemProps {
   name: string;
   price: number;
   img?: string;
   quantity: number;
}

const CheckoutOrderItem: FC<CheckoutOrderItemProps> = ({
   report,
   quantity,
   selectedLicense,
   handleRemoveItem,
   handleChangeQuantity,
}) => {
   let name = report?.title,
      price = selectedLicense?.price?.amount,
      img = report?.highlightImage?.data?.attributes?.url;
   return (
      <div className='space-y-1 border-b border-s-500 pb-4 pt-4 first-of-type:pt-0 last-of-type:border-0 last-of-type:pb-0'>
         <div className='flex items-center gap-3'>
            <span
               className='cursor-pointer text-xl text-gray-500'
               onClick={handleRemoveItem?.bind(this, report?.id)}
            >
               <IoCloseCircle />
            </span>
            <img
               src={img}
               alt=''
               className='h-16 w-16 rounded-sm border border-s-300'
            />
            <p className='font-semibold text-blue-3'>{name}</p>
         </div>
         <div className='flex items-center justify-between pt-2'>
            <div className='flex gap-4 rounded-md border border-s-300 px-4 py-2'>
               <button
                  className='text-xl text-blue-2 disabled:text-gray-300'
                  disabled={quantity === 1}
                  onClick={handleChangeQuantity?.bind(
                     this,
                     report?.id,
                     quantity - 1,
                  )}
               >
                  <FaCircleMinus />
               </button>
               <p className='text-sm text-gray-700'>{quantity}</p>
               <button
                  className='text-xl text-blue-2 disabled:text-gray-300'
                  onClick={handleChangeQuantity?.bind(
                     this,
                     report?.id,
                     quantity + 1,
                  )}
               >
                  <FaCirclePlus />
               </button>
            </div>
            <p className='font-semibold text-blue-3 md:text-lg'>${price}</p>
         </div>
      </div>
   );
};

export default CheckoutOrderItem;
