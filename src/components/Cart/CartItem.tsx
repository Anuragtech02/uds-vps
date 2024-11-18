import reportPlaceholder from '@/assets/img/sampleResearch.png';
import { FC } from 'react';
import { FaCircleMinus, FaCirclePlus } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';

interface CartItemProps {
   name: string;
   price: number;
   img?: string;
   quantity: number;
   selectedLicense: any;
   report: any;
   handleRemoveItem: (id: number) => void;
   handleChangeQuantity: (id: number, quantity: number) => void;
}

const CartItem: FC<CartItemProps> = ({
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
      <div className='flex flex-col justify-between gap-6 border-b border-s-500 pb-4 pt-4 font-semibold first-of-type:pt-0 last-of-type:border-0 last-of-type:pb-0 sm:flex-row sm:gap-0 md:text-lg'>
         <div className='flex shrink flex-col items-center gap-3 sm:w-1/2 sm:flex-row'>
            <div className='flex items-center gap-3'>
               <span
                  className='cursor-pointer text-lg text-gray-500 md:text-xl'
                  onClick={handleRemoveItem.bind(this, report?.id)}
               >
                  <IoCloseCircle />
               </span>
               <img
                  src={img}
                  alt=''
                  className='w-[80%] rounded-sm border border-s-300 sm:h-10 sm:w-10 md:h-16 md:w-16'
               />
            </div>
            <p className='text-blue-3'>{name}</p>
         </div>
         <div className='flex items-center gap-3 sm:w-1/2 md:gap-6'>
            <div className='w-1/3'>
               <p className='text-blue-3'>${price}</p>
            </div>
            <div className='flex w-1/3 justify-center sm:block'>
               <div className='flex w-max gap-2 rounded-md border border-s-300 px-2 py-1 md:gap-4 md:px-4 md:py-2'>
                  <button
                     className='text-blue-2 disabled:text-gray-300 md:text-xl'
                     disabled={quantity === 1}
                     onClick={handleChangeQuantity.bind(
                        this,
                        report?.id,
                        quantity - 1,
                     )}
                  >
                     <FaCircleMinus />
                  </button>
                  <p className='text-sm font-normal text-gray-700'>
                     {quantity}
                  </p>
                  <button
                     className='text-blue-2 disabled:text-gray-300 md:text-xl'
                     onClick={handleChangeQuantity.bind(
                        this,
                        report?.id,
                        quantity + 1,
                     )}
                  >
                     <FaCirclePlus />
                  </button>
               </div>
            </div>

            <div className='w-1/3 text-right'>
               <p className='text-blue-3'>${price * quantity}</p>
            </div>
         </div>
      </div>
   );
};

export default CartItem;
