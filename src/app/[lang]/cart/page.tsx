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
} from '@/utils/api/csr-services';
import {
   ICartItem,
   changeLicenseOfReport,
   changeQuantityOfReport,
   getCart,
   removeItemFromCart,
   resetCart,
} from '@/utils/cart-utils.util';
import { CURRENCIES } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const CurrencySelector = ({ selectedCurrency, onCurrencyChange }: {
   selectedCurrency: string;
   onCurrencyChange: (currency: string) => void;
}) => {
   return (
     <div className="flex items-center space-x-2">
       <span className="text-sm text-gray-600">Currency:</span>
       <select
         aria-label="Currency Selector"
         value={selectedCurrency}
         onChange={(e) => onCurrencyChange(e.target.value)}
         className="border border-gray-200 rounded-md px-2 py-1 text-sm"
       >
         {Object.keys(CURRENCIES).map((currency) => (
           <option key={currency} value={currency}>
             {CURRENCIES[currency].symbol} {currency}
           </option>
         ))}
       </select>
     </div>
   );
};

const Cart = () => {
   const [cartData, setCartData] = useState<ICartItem[]>([]);
   const [totalCost, setTotalCost] = useState(0);
   const [selectedCurrency, setSelectedCurrency] = useState('INR');
   const [exchangeRates, setExchangeRates] = useState<any>({});
   const router = useRouter();
   const cartStore = useCartStore();
   const licenseStore = useSelectedLicenseStore();

   const fetchRates = async () => {
      try {
         const response = await fetch(`https://free.ratesdb.com/v1/rates?from=USD`, {
            headers: {
               'Content-Type': 'application/json',

            }
         });
         const data = await response.json();
         
         // Set exchange rates with USD as base
         setExchangeRates({ ...data.data.rates, USD: 1 });
      } catch (error) {
         console.error('Error fetching exchange rates:', error);
      }
   };

   useEffect(() => {
      fetchRates();
   }, []); // Only fetch rates once on component mount

   const convertPrice = (amount: number | undefined) => {
      if (amount === undefined || isNaN(amount)) return 0;
      if (!exchangeRates[selectedCurrency]) return amount;

      // Convert from INR to selected currency using USD as base
      const inrToUsd = exchangeRates.INR ? 1 / exchangeRates.INR : 0;
      const amountInUsd = amount * inrToUsd;
      const rate = exchangeRates[selectedCurrency];
      
      return Number((amountInUsd * rate).toFixed(2));
   };

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

   const handleCurrencyChange = (newCurrency: string) => {
      setSelectedCurrency(newCurrency);
   };

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
            <div className="flex justify-between items-center">
               <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Cart
               </h1>
               <CurrencySelector 
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
               />
            </div>

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
                        convertPrice={convertPrice}
                        selectedCurrency={selectedCurrency}
                        currencySymbol={CURRENCIES[selectedCurrency].symbol}
                     />
                  ))}
               </div>
            </div>

            {/* Cost Calculations */}
            <div className="rounded-xl border border-gray-200 p-6">
               <CostCalculations 
                  cost={convertPrice(totalCost) as number} 
                  city="Mumbai" 
                  currency={CURRENCIES[selectedCurrency]}
               />
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