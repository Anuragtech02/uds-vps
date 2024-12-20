'use client';
export const runtime = 'edge';
import CartItem from '@/components/Cart/CartItem';
import CostCalculations from '@/components/Cart/CostCalculations';
import BillingDetails from '@/components/Checkout/BillingDetails';
import Button from '@/components/commons/Button';
import { useCartStore } from '@/stores/cart.store';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import {
   createOrder,
   createPayment,
   getCurrencyRates,
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
import { BillingFormData, CheckoutProvider, useCheckout } from '@/utils/CheckoutContext';
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

const CartPage = () => {
   const { formData, phone, setErrors } = useCheckout();
   const [cartData, setCartData] = useState<ICartItem[]>([]);
   const [totalCost, setTotalCost] = useState(0);
   const [selectedCurrency, setSelectedCurrency] = useState('USD');
   const [exchangeRates, setExchangeRates] = useState<any>({});
   const router = useRouter();
   const cartStore = useCartStore();
   const licenseStore = useSelectedLicenseStore();


    const validateForm = () => {
        const newErrors: Partial<BillingFormData> = {};
        
        // Validate required fields
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!phone) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

   const fetchRates = async () => {
      try {
         const data = await getCurrencyRates(); 
         
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
      const amountInUsd = amount;
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

   const handleCheckout = async (e: any) => {
      e.preventDefault();
      
      if (!validateForm()) {
      alert("Please fill in all required fields correctly.");
        return;
      }     
      try {
         const orderId: string = await createOrderIdFromRazorPay(totalCost);
         const createdOrder = await createOrder({
            reports: cartData?.map((item: any) => item?.report?.id),
            orderId,
            taxAmount: {
               currency: selectedCurrency,
               amount: 0,
            },
            totalAmount: {
               currency: selectedCurrency,
               amount: totalCost,
            },
         });

         const strapiOrderId = createdOrder?.data?.id;
         
         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: totalCost * 100,
            currency: selectedCurrency,
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
                     currency: selectedCurrency,
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
      <CheckoutProvider>
         <form onSubmit={(e) => handleCheckout(e)} className="container mx-auto px-4 pt-48 flex flex-col md:flex-row justify-between items-start [&>div]:flex-1 gap-6 pb-10">
            <Script
               id="razorpay-checkout-js"
               src="https://checkout.razorpay.com/v1/checkout.js"
            />

               <BillingDetails />
               
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
                        <div className="w-[40%]">
                           <span>Product</span>
                        </div>
                        <div className='w-1/2 sm:w-1/5'>
                           <span>Select License</span>
                        </div>
                        <div className="w-32 text-right ml-auto">
                           <span>Price</span>
                        </div>
                        {/* <div className="w-32 text-right ml-auto">
                           <span>Subtotal</span>
                        </div> */}
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
                        className="min-w-[200px]"
                        type='submit'
                        >
                        Proceed to Checkout
                     </Button>
                  </div>
               </div>
         </form>
      </CheckoutProvider>
   );
};

export default CartPage;