'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import Button from './Button';
import Script from 'next/script';
import countryList from '@/assets/utils/countries.json';
import { submitForm } from '@/utils/api/csr-services';
import CustomPhoneInput from '../CustomPhoneInput';

const GetCallBackForm = () => {
   const [formFields, setFormFields] = useState({
      fullName: '',
      businessEmail: '',
      country: '',
      message: '',
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   const [turnstileToken, setTurnstileToken] = useState<string>('');
   const [phone, setPhone] = useState('');
   const widgetIdRef = useRef<string>('');
   const turnstileContainerId = 'callback-turnstile-container';

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
                  setSubmitError(null);
               },
               'expired-callback': function () {
                  setTurnstileToken('');
                  setSubmitError('Verification expired. Please verify again.');
               },
               'error-callback': function () {
                  setSubmitError(
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

   const handleInputChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
   ) => {
      setFormFields({
         ...formFields,
         [e.target.name]: e.target.value,
      });
   };

   const handlePhoneChange = (phone: string) => {
      setPhone(phone);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      // Clear both messages at the start
      setSubmitError(null);
      setSubmitSuccess(false);

      if (!turnstileToken) {
         setSubmitError('Please complete the verification');
         setIsSubmitting(false);
         return;
      }

      const requestData = {
         ...formFields,
         mobileNumber: phone,
         source: window.location.href,
      };

      try {
         const response = await submitForm('callback', {
            ...requestData,
            rawData: {
               ...requestData,
               cfTurnstileResponse: turnstileToken,
            },
         });

         setSubmitSuccess(true);
         setSubmitError(null); // Ensure error is cleared

         // Reset form fields
         setFormFields({
            fullName: '',
            businessEmail: '',
            country: '',
            message: '',
         });
         setPhone('');
         setSubmitError(null); // Ensure error is cleared on success

         setTimeout(() => {
            setSubmitSuccess(false);
         }, 5000); // Reset success message after 5 seconds
         // Reset Turnstile after successful submission
         if (window.turnstile) {
            window.turnstile.reset(`#${turnstileContainerId}`);
         }
      } catch (error) {
         // Handle error case
         setSubmitSuccess(false);
         setSubmitError('An error occurred. Please try again.');
         console.error('Form submission error:', error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <Script
            src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
            async
            defer
         />

         <div className='rounded-xl border border-s-300 p-4 md:p-6'>
            <p className='mb-4 font-semibold text-s-700 md:text-lg'>
               Get a call back
            </p>
            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='fullName' className='text-sm font-semibold'>
                     Name*
                  </label>
                  <input
                     type='text'
                     id='fullName'
                     name='fullName'
                     required
                     value={formFields.fullName}
                     onChange={handleInputChange}
                     placeholder='Enter your name'
                     className='rounded-md border border-s-300 p-2 text-sm md:text-base'
                  />
               </div>

               <div className='flex flex-col gap-1'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <CustomPhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                     />
                  </div>
               </div>

               <div className='flex flex-col gap-1'>
                  <label
                     htmlFor='businessEmail'
                     className='text-sm font-semibold'
                  >
                     Business Email*
                  </label>
                  <input
                     type='businessEmail'
                     id='businessEmail'
                     name='businessEmail'
                     required
                     value={formFields.businessEmail}
                     onChange={handleInputChange}
                     placeholder='Enter your email'
                     className='rounded-md border border-s-300 p-2 text-sm md:text-base'
                  />
               </div>

               <div className='flex flex-col gap-1'>
                  <label htmlFor='country' className='text-sm font-semibold'>
                     Country*
                  </label>
                  <select
                     id='country'
                     name='country'
                     required
                     value={formFields.country}
                     onChange={handleInputChange}
                     className='rounded-md border border-s-300 p-2 text-sm md:text-base'
                  >
                     <option value='' className='text-gray-400'>
                        Select your country
                     </option>
                     {countryList?.map((country) => (
                        <option key={country.code} value={country.name}>
                           {country.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div className='flex flex-col gap-1'>
                  <label htmlFor='message' className='text-sm font-semibold'>
                     Message*
                  </label>
                  <textarea
                     id='message'
                     name='message'
                     required
                     value={formFields.message}
                     onChange={handleInputChange}
                     placeholder='Enter your message'
                     className='rounded-md border border-s-300 p-2 text-sm md:text-base'
                     rows={4}
                  />
               </div>

               {/* Cloudflare Turnstile */}
               <div className='space-y-2'>
                  <div id={turnstileContainerId}></div>
               </div>
               {submitError ? (
                  <div className='rounded-md bg-red-50 p-4 text-red-800'>
                     {submitError}
                  </div>
               ) : submitSuccess ? (
                  <div className='rounded-md bg-green-50 p-4 text-green-800'>
                     Thank you! Your message has been sent successfully.
                  </div>
               ) : null}

               <div>
                  <Button
                     className='mt-4 w-full'
                     variant='secondary'
                     type='submit'
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
               </div>
            </form>
         </div>
      </>
   );
};

export default GetCallBackForm;
