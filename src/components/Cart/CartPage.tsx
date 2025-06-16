'use client';
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
import { BillingFormData, useCheckout } from '@/utils/CheckoutContext';
import { CURRENCIES } from '@/utils/constants';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

const CurrencySelector = ({
   selectedCurrency,
   onCurrencyChange,
}: {
   selectedCurrency: string;
   onCurrencyChange: (currency: string) => void;
}) => {
   const { locale } = useLocale();

   useEffect(() => {
      if (locale && locale !== 'en') {
         switch (locale) {
            case 'es':
            case 'fr':
            case 'de':
            case 'it':
               // Default to EUR for European languages
               onCurrencyChange('EUR');
               break;
            case 'ja':
               // Japanese -> JPY
               onCurrencyChange('JPY');
               break;
            case 'zh-CN':
            case 'zh-Hant-TW':
               // Chinese -> USD (as default)
               onCurrencyChange('USD');
               break;
            case 'ar':
               // Arabic -> USD (as default)
               onCurrencyChange('USD');
               break;
            default:
               // Keep current currency or set to USD
               break;
         }
      }
   }, [locale, onCurrencyChange]);

   return (
      <div className='flex items-center space-x-2'>
         <span className='text-sm text-gray-600'>
            {TRANSLATED_VALUES[locale]?.cart.currency}:
         </span>
         <select
            aria-label='Currency Selector'
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className='rounded-md border border-gray-200 px-2 py-1 text-sm'
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

const getDiscountPercentage = (
   licenseType: 'Single User License' | 'Site License' | 'Global License',
): number => {
   if (licenseType === null) return 0;

   switch (licenseType) {
      case 'Single User License': // Single license
         return 10;
      case 'Site License': // Site license
         return 20;
      case 'Global License': // Global license
         return 30;
      default:
         return 0;
   }
};

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY']; // Add all supported currencies

const convertToSmallestUnit = (amount: number, currency: string) => {
   const currencyMultipliers: { [key: string]: number } = {
      USD: 100, // cents
      EUR: 100, // cents
      GBP: 100, // pence
      JPY: 1, // no decimal places
      INR: 100, // paise
      // Add other currencies as needed
   };

   const multiplier = currencyMultipliers[currency] || 100;
   return Math.round(amount * multiplier);
};

const CartPage = () => {
   const {
      formData,
      setErrors,
      errors,
      selectedCurrency,
      setSelectedCurrency,
   } = useCheckout();
   const [totalCost, setTotalCost] = useState(0);
   const [exchangeRates, setExchangeRates] = useState<any>({});
   const router = useRouter();
   const cartStore = useCartStore();
   const licenseStore = useSelectedLicenseStore();
   const [turnstileToken, setTurnstileToken] = useState<string>('');
   const [turnstileError, setTurnstileError] = useState<string | null>(null);
   const widgetIdRef = useRef<string>('');
   const turnstileContainerId = 'callback-turnstile-container';

   const { locale } = useLocale();

   const cleanupTurnstile = () => {
      if (widgetIdRef.current && window.turnstile) {
         try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = '';
         } catch (error) {
            console.error('Error cleaning up Turnstile:', error);
         }
      }
   };

   const initializeTurnstile = () => {
      // Clean up existing widget first
      cleanupTurnstile();

      // Check if container exists
      const container = document.getElementById(turnstileContainerId);
      if (!container || !window.turnstile) return;

      try {
         const newWidgetId = window.turnstile.render(
            `#${turnstileContainerId}`,
            {
               sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
               callback: function (token: string) {
                  console.log('Challenge Success');
                  setTurnstileToken(token);
                  setTurnstileError(null);
               },
               'expired-callback': function () {
                  setTurnstileToken('');
                  setTurnstileError(
                     'Verification expired. Please verify again.',
                  );
               },
               'error-callback': function () {
                  setTurnstileError(
                     'Error during verification. Please try again.',
                  );
               },
            },
         );
         widgetIdRef.current = newWidgetId;
      } catch (error) {
         console.error('Error initializing Turnstile:', error);
      }
   };

   useEffect(() => {
      // Set up Turnstile callback
      window.onloadTurnstileCallback = initializeTurnstile;

      // If Turnstile is already loaded, initialize immediately
      if (window.turnstile) {
         initializeTurnstile();
      }

      return () => {
         cleanupTurnstile();
         // @ts-expect-error - window.onloadTurnstileCallback is defined
         delete window.onloadTurnstileCallback;
      };
   }, []);

   const validateForm = useCallback(() => {
      const newErrors: Partial<BillingFormData> = {};

      // Validate required fields
      if (!formData.firstName?.trim())
         newErrors.firstName = 'First name is required';
      if (!formData.lastName?.trim())
         newErrors.lastName = 'Last name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = 'Invalid email format';
      }
      if (!formData.country?.trim()) newErrors.country = 'Country is required';
      if (!formData.state?.trim()) newErrors.state = 'State is required';
      if (!formData.city?.trim()) newErrors.city = 'City is required';
      if (!formData.address?.trim()) newErrors.address = 'Address is required';
      if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';

      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   }, [formData, setErrors]);

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
            return (
               acc +
               (item?.selectedLicense?.price?.amount || 0) *
                  (item.quantity || 1)
            );
         }, 0),
      );
   };

   useEffect(() => {
      const cart = getCart();
      cartStore.updateCart(cart);
      updateTotalCost(cart);
   }, []);

   const calculateDiscounts = useCallback(() => {
      return cartStore.reports.reduce((acc, item) => {
         const discountPercentage = getDiscountPercentage(
            getSelectedReportLicenseTitle(item?.report?.id),
         );
         const originalPrice = item?.selectedLicense?.price?.amount || 0;
         const discountAmount = (discountPercentage / 100) * originalPrice;
         return acc + convertPrice(discountAmount);
      }, 0);
   }, [cartStore.reports, convertPrice]);

   const handleCurrencyChange = (newCurrency: string) => {
      if (!SUPPORTED_CURRENCIES.includes(newCurrency)) {
         alert(`Currency ${newCurrency} is not supported`);
         console.error(`Currency ${newCurrency} is not supported`);
         return;
      }
      setSelectedCurrency(newCurrency);
   };

   const handleChangeQuantity = (reportId: number, quantity: number) => {
      const updatedCart = cartStore.reports.map((item: any) =>
         item?.report?.id === reportId ? { ...item, quantity } : item,
      );
      cartStore.updateCart(updatedCart);
      updateTotalCost(updatedCart);
      changeQuantityOfReport(reportId, quantity);
   };

   const handleRemoveItem = (reportId: number) => {
      const updatedCart = cartStore.reports?.filter(
         (item: any) => item?.report?.id !== reportId,
      );
      cartStore.updateCart(updatedCart);
      updateTotalCost(updatedCart);
      removeItemFromCart(reportId);
   };

   const handleChangeLicense = (reportId: number, newLicense: any) => {
      const updatedCart = cartStore.reports.map((item: any) =>
         item?.report?.id === reportId
            ? { ...item, selectedLicense: newLicense }
            : item,
      );
      cartStore.updateCart(updatedCart);
      updateTotalCost(updatedCart);
      changeLicenseOfReport(reportId, newLicense);
   };

   const handleCheckout = async (e: any) => {
      e.preventDefault();

      if (!turnstileToken) {
         alert('Please complete the security verification');
         return;
      }

      if (!validateForm()) {
         const invalidFields = Object.keys(errors).join(', ');
         alert(
            `Please fill in all required fields. Missing fields: ${invalidFields}`,
         );
         return;
      }

      try {
         const totalDiscounts = calculateDiscounts();
         // const finalAmount = Number(
         //    (convertPrice(totalCost) - totalDiscounts).toFixed(2),
         // );
         const subtotal = convertPrice(totalCost) - totalDiscounts;
         const taxRate = formData.country === 'IND' ? 0.18 : 0;
         const taxAmount = subtotal * taxRate;
         const finalAmount = Number((subtotal + taxAmount).toFixed(2));
         const razorpayAmount = convertToSmallestUnit(
            finalAmount,
            selectedCurrency,
         );
         const orderData: any = await createOrderIdFromRazorPay(
            razorpayAmount,
            selectedCurrency,
         );
         const orderId = orderData?.orderId;
         const razorpayReceipt = orderData?.receipt;

         const createdOrder = await createOrder({
            reports: cartStore.reports?.map((item: any) => item?.report?.id),
            razorpayOrderId: orderId,
            razorpayReceipt,
            totalAmount: {
               currency: selectedCurrency,
               amount: totalCost,
            },
            manualDiscountAmount: Number(totalDiscounts.toFixed(2)),
            billingDetails: {
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               phone: formData.phone,
               country: formData.country,
               state: formData.state,
               city: formData.city,
               address: formData.address,
               orderNotes: formData.orderNotes || '',
            },
            rawData: {
               cfTurnstileResponse: turnstileToken,
            },
         });

         const strapiOrderId = createdOrder?.data?.id;

         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: razorpayAmount,
            currency: selectedCurrency,
            name: 'UnivDatos',
            description:
               'Please complete the payment to purchase the report(s) ' +
               cartStore.reports
                  .map((item: any) => item?.report?.title)
                  .join(', '),
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
               const res = await result;
               // console.log('reslut', res);

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

         const paymentObject = new window.Razorpay(options);
         paymentObject.on('payment.failed', async function (response: any) {
            console.error(response.error.description);
            await updateOrderStatus(strapiOrderId, 'FAILED');
         });
         paymentObject.open();
      } catch (error) {
         console.error('Checkout error:', error);
         alert('Error processing payment. Please try again later.');
      }
   };

   function getSelectedReportLicenseTitle(reportId: number) {
      const report = cartStore.reports.find(
         (item: any) => item?.report?.id === reportId,
      );
      return report?.selectedLicense?.title;
   }

   return (
      <form
         onSubmit={(e) => handleCheckout(e)}
         className='container mx-auto flex flex-col items-start justify-between gap-6 px-4 pb-10 pt-48 lg:flex-row'
      >
         <Script
            id='razorpay-checkout-js'
            src='https://checkout.razorpay.com/v1/checkout.js'
         />

         <Script
            src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
            async
            defer
         />

         <div className='w-full lg:w-[40%]'>
            <BillingDetails />
         </div>

         <div className='mt-5 w-full space-y-6 rounded-xl bg-white p-6 lg:w-[60%]'>
            <div className='flex items-center justify-between'>
               <h1 className='text-2xl font-semibold text-gray-900 lg:text-3xl'>
                  {TRANSLATED_VALUES[locale]?.cart?.cart}
               </h1>
               <CurrencySelector
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
               />
            </div>

            {/* Cart Items Container */}
            <div className='rounded-xl border border-gray-200 p-6'>
               {/* Cart Headers */}
               <div className='flex items-center border-b border-gray-200 pb-2 font-medium text-gray-600'>
                  <div className='w-[40%]'>
                     <span>{TRANSLATED_VALUES[locale]?.cart?.product}</span>
                  </div>
                  <div className='w-1/2 sm:w-2/5'>
                     <span>
                        {TRANSLATED_VALUES[locale]?.cart?.selectLicense}
                     </span>
                  </div>
                  <div className='ml-auto w-32 text-right'>
                     <span>{TRANSLATED_VALUES[locale]?.cart?.price}</span>
                  </div>
                  {/* <div className="w-32 text-right ml-auto">
                           <span>Subtotal</span>
                        </div> */}
               </div>

               {/* Cart Items */}
               {cartStore.reports.length === 0 ? (
                  <div className='py-8 text-center text-gray-500'>
                     {TRANSLATED_VALUES[locale]?.cart?.noItemsInCart}
                  </div>
               ) : (
                  <div className='divide-y divide-gray-200'>
                     {cartStore.reports.map((item: any, i) => (
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
               )}
            </div>

            {/* Cost Calculations */}
            <div className='rounded-xl border border-gray-200 p-6'>
               <CostCalculations
                  cost={convertPrice(totalCost) as number}
                  city={formData.city}
                  country={formData.country} // Add this line
                  currency={{
                     name: selectedCurrency,
                     symbol: CURRENCIES[selectedCurrency].symbol,
                  }}
                  totalDiscounts={calculateDiscounts()}
                  discountPercentages={cartStore.reports.map((item) =>
                     getDiscountPercentage(
                        getSelectedReportLicenseTitle(item?.report?.id),
                     ),
                  )}
               />
            </div>

            {/* Checkout Button */}
            <div className='flex flex-col items-center justify-between md:flex-row'>
               <div className='rounded-xl'>
                  <div className='space-y-2'>
                     <div id={turnstileContainerId}></div>
                     {turnstileError && (
                        <p className='text-sm text-red-500'>{turnstileError}</p>
                     )}
                  </div>
               </div>
               <Button
                  variant='secondary'
                  className='mt-4 min-w-[200px] sm:mt-0'
                  type='submit'
                  disabled={cartStore.reports.length === 0}
               >
                  {TRANSLATED_VALUES[locale]?.cart?.proceedToCheckout}
               </Button>
            </div>
         </div>
         {/* Assistance Section */}
         <div className='mt-6 block w-full rounded-xl bg-white p-6 sm:hidden'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-800'>
               {TRANSLATED_VALUES[locale]?.cart?.needAssistance}
            </h2>
            <p className='mb-4 font-bold text-gray-600'>
               {TRANSLATED_VALUES[locale]?.cart?.callOrWrite}
            </p>
            <div className='space-y-2'>
               <p className='text-gray-700'>
                  <span className='font-medium'>
                     {TRANSLATED_VALUES[locale]?.cart?.phone}:
                  </span>{' '}
                  <a
                     href='tel:+1-888-689-0688'
                     className='font-bold text-blue-600 hover:text-blue-800'
                  >
                     +1 9787330253
                  </a>
               </p>
               <p className='text-gray-700'>
                  <span className='font-medium'>
                     {TRANSLATED_VALUES[locale]?.cart?.email}:
                  </span>{' '}
                  <a
                     href='mailto:sales@univdatos.com'
                     className='font-bold text-blue-600 hover:text-blue-800'
                  >
                     sales@univdatos.com
                  </a>
               </p>
            </div>
         </div>
      </form>
   );
};

export default CartPage;
