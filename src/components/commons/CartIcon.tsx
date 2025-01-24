'use client';

import { getCart } from '@/utils/cart-utils.util';
import React, { useEffect, useState } from 'react';
import { LocalizedLink } from './LocalizedLink';
import { IoMdCart } from 'react-icons/io';
import { useCartStore } from '@/stores/cart.store';

const CartIcon = () => {
   const cartStore = useCartStore();
   return (
      <LocalizedLink href='/cart' className='relative'>
         <span className='block cursor-pointer rounded-md border border-blue-4 p-2 text-xl sm:text-3xl'>
            <IoMdCart />
            {/* Tooltip for cart items */}
            {cartStore.reports.length > 0 && (
               <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                  {cartStore.reports.length}
               </span>
            )}
         </span>
      </LocalizedLink>
   );
};

export default CartIcon;
