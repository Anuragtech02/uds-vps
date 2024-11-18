'use client';
import Link from 'next/link';
import Button from '../commons/Button';
import CheckoutOrderItem from './CheckoutOrderItem';
import CostCalculations from './CostCalculations';
import PaymentGateways from './PaymentGateways';
import { useEffect, useState } from 'react';
import {
   changeQuantityOfReport,
   getCart,
   ICartItem,
   removeItemFromCart,
} from '@/utils/cart-utils.util';

// Define types for cart items
interface License {
   price: {
      amount: number;
   };
}

interface Report {
   id: number;
   name: string;
}

const Order = () => {
   const [cartData, setCartData] = useState<ICartItem[]>([]);
   const [totalCost, setTotalCost] = useState<number>(0);

   // Function to calculate total cost with proper typing
   const updateTotalCost = (cart: ICartItem[]) => {
      setTotalCost(
         cart.reduce((acc, item) => {
            // @ts-ignore
            return acc + item.selectedLicense?.price.amount * item.quantity;
         }, 0),
      );
   };

   useEffect(() => {
      const cart = getCart(); // Assuming getCart returns CartItem[]
      setCartData(cart);
      updateTotalCost(cart);
   }, []);

   const handleChangeQuantity = (reportId: number, quantity: number) => {
      const updatedCart = cartData.map((item) =>
         item.report.id === reportId ? { ...item, quantity } : item,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      changeQuantityOfReport(reportId, quantity);
   };

   const handleRemoveItem = (reportId: number) => {
      const updatedCart = cartData.filter(
         (item) => item.report.id !== reportId,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      removeItemFromCart(reportId);
   };

   return (
      <div className='space-y-4 md:space-y-6'>
         <p className='text-2xl font-bold text-s-600'>Your order</p>
         <div className='rounded-xl border border-s-400 p-3'>
            {cartData.map((item) => (
               <CheckoutOrderItem
                  key={item.report.id}
                  {...item}
                  handleChangeQuantity={handleChangeQuantity}
                  handleRemoveItem={handleRemoveItem}
               />
            ))}
         </div>
         <div className='rounded-xl border border-s-400 p-3'>
            <CostCalculations cost={totalCost} city='Mumbai' />
         </div>
         <div>
            <PaymentGateways />
         </div>
         <div className='flex items-start gap-2'>
            <input type='checkbox' name='tnc' id='tnc' className='mt-2' />
            <label htmlFor='tnc' className='text-gray-500'>
               Your personal data will be used to process your order, support
               your experience throughout this website, and for other purposes
               described in our{' '}
               <Link className='underline' href='/privacy-policy'>
                  privacy policy
               </Link>
               . <br />I have read and agree to the website{' '}
               <Link className='underline' href='/terms-and-conditions'>
                  terms and conditions
               </Link>
               *
            </label>
         </div>
         <Button variant='secondary' className='w-full'>
            Proceed to checkout
         </Button>
      </div>
   );
};

export default Order;
