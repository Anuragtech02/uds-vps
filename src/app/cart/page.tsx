'use client';
export const runtime = 'edge';
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
   changeLicenseOfReport,
   changeQuantityOfReport,
   getCart,
   removeItemFromCart,
   resetCart,
} from '@/utils/cart-utils.util';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const Cart = () => {
   const [cartData, setCartData] = useState<ICartItem[]>([]);
   const [totalCost, setTotalCost] = useState(0);
   const router = useRouter();
   const cartStore = useCartStore();
   const licenseStore = useSelectedLicenseStore();

   const updateTotalCost = (cart: any[]) => {
      setTotalCost(
         cart.reduce((acc, item) => {
            return acc + (item?.selectedLicense?.price?.amount || 0) * (item.quantity || 1);
         }, 0),
      );
   };

   useEffect(() => {
      const cart = getCart();
      setCartData(cart);
      updateTotalCost(cart);
   }, []);

   const handleChangeQuantity = (reportId: number, quantity: number) => {
      const updatedCart = cartData.map((item: any) =>
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


   const handleChangeLicense = (reportId: number, newLicense: any) => {
      const updatedCart = cartData.map((item: any) =>
         item?.report?.id === reportId ? { ...item, selectedLicense: newLicense } : item,
      );
      setCartData(updatedCart);
      updateTotalCost(updatedCart);
      changeLicenseOfReport(reportId, newLicense);
   };


   const processPayment = async (e: React.MouseEvent) => {
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

         const strapiOrderId = createdOrder?.data?.id;
         
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

               const createdPayment = await createPayment({
                  paymentId: response.razorpay_payment_id,
                  order: strapiOrderId,
                  amount: {
                     currency: 'INR',
                     amount: totalCost,
                  },
               });

               const strapiPaymentId = createdPayment?.data?.id;
               const result = await verifyPayments(data);
               const res = await result?.json();

               if (res.isOk) {
                  await updatePaymentStatus(strapiPaymentId, 'SUCCESS');
                  await updateOrderStatus(strapiOrderId, 'SUCCESS');
                  cartStore.resetCart();
                  resetCart();
                  licenseStore.resetLicenses();
                  router.replace('/payment-success');
               } else {
                  await updatePaymentStatus(strapiPaymentId, 'CANCEL');
                  await updateOrderStatus(strapiOrderId, 'FAILED');
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

         // @ts-expect-error
         const paymentObject = new window.Razorpay(options);
         paymentObject.on('payment.failed', async function (response: any) {
            console.error(response.error.description);
            await updateOrderStatus(strapiOrderId, 'FAILED');
         });
         paymentObject.open();
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="container mx-auto px-4 pt-40">
         <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
         />
         
         <div className="mt-5 w-full space-y-6 rounded-xl bg-white p-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
               Cart
            </h1>

            {/* Cart Items Container */}
            <div className="rounded-xl border border-gray-200 p-6">
               {/* Cart Headers */}
               <div className="flex items-center text-gray-600 font-medium pb-2 border-b border-gray-200">
                  <div className="flex-grow">
                     <span>Product</span>
                  </div>
                  <div className="w-32 text-right">
                     <span>Price</span>
                  </div>
                  <div className="w-32 text-right">
                     <span>Subtotal</span>
                  </div>
               </div>

               {/* Cart Items */}
               <div className="divide-y divide-gray-200">
                  {cartData.map((item: any, i) => (
                     <CartItem
                        key={i}
                        {...item}
                        handleRemoveItem={handleRemoveItem}
                        handleChangeQuantity={handleChangeQuantity}
                        handleChangeLicense={handleChangeLicense}
                     />
                  ))}
               </div>
            </div>

            {/* Cost Calculations */}
            <div className="rounded-xl border border-gray-200 p-6">
               <CostCalculations cost={totalCost} city="Mumbai" />
            </div>

            {/* Checkout Button */}
            <div className="flex justify-end">
               <Button
                  variant="secondary"
                  onClick={() => processPayment}
                  className="min-w-[200px]"
               >
                  Proceed to Checkout
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Cart;