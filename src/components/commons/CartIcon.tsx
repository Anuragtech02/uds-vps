'use client';

import { getCart } from '@/utils/cart-utils.util';
import React, { useEffect, useState } from 'react';
import { LocalizedLink } from './LocalizedLink';
import { IoMdCart } from 'react-icons/io';

const CartIcon = () => {
   const [cartItemsLength, setCartItemsLength] = useState(0);

   useEffect(() => {
      const cart = getCart();
      setCartItemsLength(cart.length);
   }, []);

   useEffect(() => {
      const handleStorageChange = () => {
         const cart = getCart();
         setCartItemsLength(cart.length);
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
         window.removeEventListener('storage', handleStorageChange);
      };
   }, []);

   return (
      <LocalizedLink href='/cart' className='relative'>
         <span className='block cursor-pointer rounded-md border border-blue-4 p-2 text-3xl'>
            <IoMdCart />
            {/* Tooltip for cart items */}
            {cartItemsLength > 0 && (
               <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                  {cartItemsLength}
               </span>
            )}
         </span>
      </LocalizedLink>
   );
};

export default CartIcon;
