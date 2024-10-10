'use client';
import CartItem from '@/components/Cart/CartItem';
import CostCalculations from '@/components/Cart/CostCalculations';
import Button from '@/components/commons/Button';
import {
   changeQuantityOfReport,
   getCart,
   removeItemFromCart,
} from '@/utils/cart-utils.util';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sampleCartItems = [
   {
      id: 1,
      name: 'Product 1',
      price: 100,
      quantity: 1,
   },
   {
      id: 2,
      name: 'Product 2',
      price: 200,
      quantity: 2,
   },
   {
      id: 3,
      name: 'Product 3',
      price: 300,
      quantity: 3,
   },
];

const Cart = () => {
   const [cartData, setCartData] = useState([]);
   const [totalCost, setTotalCost] = useState(0);
   const updateTotalCost = (cart) => {
      setTotalCost(
         cart.reduce((acc, item) => {
            console.log(item?.selectedLicense?.price?.amount);
            return (
               acc +
               parseInt(item?.selectedLicense?.price?.amount) *
                  parseInt(item.quantity)
            );
         }, 0),
      );
   };
   useEffect(() => {
      const cart = getCart();
      setCartData(cart);
      updateTotalCost(cart);
      console.log(cart);
   }, []);
   const handleChangeQuantity = (reportId: number, quantity: number) => {
      const updatedCart = cartData.map((item) =>
         item?.report?.id === reportId ? { ...item, quantity } : item,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      changeQuantityOfReport(reportId, quantity);
   };
   const handleRemoveItem = (reportId: number) => {
      const updatedCart = cartData?.filter(
         (item) => item?.report?.id !== reportId,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      removeItemFromCart(reportId);
   };
   return (
      <div className='container pt-40'>
         <div className='mt-5 w-full space-y-4 rounded-xl bg-white p-6 md:space-y-6'>
            <div className='flex flex-wrap items-center justify-between gap-4 pb-4'>
               <div className='flex w-full items-center justify-between sm:w-max'>
                  <p className='text-[1.625rem] font-semibold text-s-800 md:text-[2rem]'>
                     Cart
                  </p>
                  <select
                     name=''
                     id=''
                     className='rounded-full bg-s-200 px-2 py-1 text-sm font-bold sm:hidden'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
               <div className='flex w-full items-stretch gap-0 sm:w-[auto] sm:gap-4'>
                  <input
                     type='text'
                     className='shrink grow basis-0 bg-gray-50 px-6 text-sm sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                     placeholder='Coupon Code'
                  />

                  <Button
                     variant='secondary'
                     className='shrink grow basis-0 sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                  >
                     Apply Code
                  </Button>

                  <select
                     name=''
                     id=''
                     className='hidden rounded-full bg-s-200 px-4 text-lg font-bold sm:block'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
            </div>
            <div className='rounded-xl border border-s-400 p-3'>
               <div className='hidden items-center justify-between font-bold text-s-600 sm:flex md:text-2xl md:text-lg'>
                  <div className='w-1/2'>
                     <p>Product</p>
                  </div>
                  <div className='flex w-1/2 items-center gap-3 md:gap-6'>
                     <div className='w-1/3'>
                        <p>Price</p>
                     </div>
                     <div className='w-1/3'>
                        <p>Quantity</p>
                     </div>
                     <div className='w-1/3'>
                        <p>Subtotal</p>
                     </div>
                  </div>
               </div>
               {cartData.map((item) => (
                  <CartItem
                     key={item.id}
                     {...item}
                     handleRemoveItem={handleRemoveItem}
                     handleChangeQuantity={handleChangeQuantity}
                  />
               ))}
            </div>
            <div className='rounded-xl border border-s-400 p-3'>
               <CostCalculations cost={totalCost} city='Mumbai' />
            </div>
            <div className='w-full text-right'>
               <Link href='/checkout'>
                  <Button variant='secondary'>Proceed to Checkout</Button>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Cart;
