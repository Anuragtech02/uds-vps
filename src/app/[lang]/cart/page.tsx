'use client';
import CartItem from '@/components/Cart/CartItem';
import CostCalculations from '@/components/Cart/CostCalculations';
import Button from '@/components/commons/Button';
import { useCartStore } from '@/stores/cart.store';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import {
   createOrder,
   createPayment,
   updateOrderStatus,
   updatePaymentStatus,
} from '@/utils/api/csr-services';
import {
   createOrderIdFromRazorPay,
   verifyPayments,
} from '@/utils/api/services';

import {
   ICartItem,
   changeQuantityOfReport,
   getCart,
   removeItemFromCart,
   resetCart,
} from '@/utils/cart-utils.util';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
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
   const [cartData, setCartData] = useState<ICartItem[]>([]);
   const [totalCost, setTotalCost] = useState(0);
   const router = useRouter();
   const cartStore = useCartStore();
   const licenseStore = useSelectedLicenseStore();
   const updateTotalCost = (cart: any[]) => {
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
      const updatedCart: any = cartData.map((item: any) =>
         item?.report?.id === reportId ? { ...item, quantity } : item,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      changeQuantityOfReport(reportId, quantity);
   };
   const handleRemoveItem = (reportId: number) => {
      const updatedCart = cartData?.filter(
         (item: any) => item?.report?.id !== reportId,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      removeItemFromCart(reportId);
   };

   const processPayment = async (e: any) => {
      e.preventDefault();
      try {
         const orderId: string = await createOrderIdFromRazorPay(totalCost);
         const createdOrder = await createOrder({
            reports: cartData?.map((item: any) => item?.report?.id),
            orderId,
            taxAmount: {
               currency: 'INR',
               amount: 0,
            },
            totalAmount: {
               currency: 'INR',
               amount: totalCost,
            },
         });
         let strapiOrderId = createdOrder?.data?.id;
         console.log(createdOrder);
         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: totalCost * 100,
            currency: 'INR',
            name: 'Univdatos',
            description: 'Please complete the payment to purchase the product',
            order_id: orderId,
            handler: async function (response: any) {
               const data = {
                  orderCreationId: orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
               };
               //call create payment on strapi
               let createdPayment = await createPayment({
                  paymentId: response.razorpay_payment_id,
                  order: strapiOrderId,
                  amount: {
                     currency: 'INR',
                     amount: totalCost,
                  },
               });
               let strapiPaymentId = createdPayment?.data?.id;
               const result = await verifyPayments(data);
               const res = await result?.json();
               if (res.isOk) {
                  alert('payment succeed');
                  //call update order and payment status to completed
                  await updatePaymentStatus(strapiPaymentId, 'SUCCESS');
                  await updateOrderStatus(strapiOrderId, 'SUCCESS');
                  //redirect to success page
                  cartStore.resetCart();
                  resetCart();
                  licenseStore.resetLicenses();
                  router.replace('/payment-success');
               } else {
                  alert(res.message);
                  await updatePaymentStatus(strapiPaymentId, 'CANCEL');
                  await updateOrderStatus(strapiOrderId, 'FAILED');
                  // router.replace('/payment-failure');
               }
            },
            prefill: {
               name: 'User',
               email: 'email',
            },
            theme: {
               color: '#3399cc',
            },
         };
         // @ts-expect-error ts-migrate(2339) FIXME: Property 'Razorpay' does not exist on type 'Window'.
         const paymentObject = new window.Razorpay(options);
         paymentObject.on('payment.failed', async function (response: any) {
            alert(response.error.description);
            console.log(response);
            await updateOrderStatus(strapiOrderId, 'FAILED');
            // router.replace('/payment-failure');
         });
         paymentObject.open();
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <div className='container pt-40'>
         <Script
            id='razorpay-checkout-js'
            src='https://checkout.razorpay.com/v1/checkout.js'
         />
         <div className='mt-5 w-full space-y-4 rounded-xl bg-white p-6 md:space-y-6'>
            <div className='flex flex-wrap items-center justify-between gap-4 pb-4'>
               <div className='flex w-full items-center justify-between sm:w-max'>
                  <p className='text-[1.625rem] font-semibold text-s-800 md:text-[2rem]'>
                     Cart
                  </p>
                  {/* <select
                     name=''
                     id=''
                     className='rounded-full bg-s-200 px-2 py-1 text-sm font-bold sm:hidden'
                     title='Currency Selector'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select> */}
               </div>
               <div className='flex w-full items-stretch gap-0 sm:w-[auto] sm:gap-4'>
                  {/* <input
                     type='text'
                     className='shrink grow basis-0 bg-gray-50 px-6 text-sm sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                     placeholder='Coupon Code'
                  />

                  <Button
                     variant='light'
                     className='shrink grow basis-0 sm:shrink-0 sm:grow-0 sm:basis-[unset]'
                  >
                     Apply Code
                  </Button> */}

                  {/* <select
                     name=''
                     id=''
                     className='hidden rounded-full bg-s-200 px-4 text-lg font-bold sm:block'
                     title='Currency Selector'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select> */}
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
                     <div className='w-1/3 text-right'>
                        <p>Subtotal</p>
                     </div>
                  </div>
               </div>
               {cartData.map((item: any, i) => (
                  <CartItem
                     key={i}
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
               <Button
                  variant='secondary'
                  onClick={() => processPayment(event)}
               >
                  Proceed to Checkout
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Cart;
