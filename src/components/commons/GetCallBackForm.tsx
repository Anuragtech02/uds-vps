'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import Button from './Button';
import Script from 'next/script';
import countryList from '@/assets/utils/countries.json';
import { submitForm } from '@/utils/api/csr-services';
import CustomPhoneInput from '../CustomPhoneInput';
import { sendGAEvent } from '@next/third-parties/google';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

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

   const { locale } = useLocale();

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

      sendGAEvent('event', 'form_initiation', {
         form_category: 'CallbackForm',
         form_action: 'Initiate',
      });

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
         sendGAEvent('event', 'form_submission', {
            form_category: 'CallbackForm',
            form_action: 'Submit',
         });
         // Reset Turnstile after successful submission
         if (window.turnstile) {
            window.turnstile.reset(`#${turnstileContainerId}`);
         }
      } catch (error) {
         // Handle error case
         setSubmitSuccess(false);
         setSubmitError('An error occurred. Please try again.');
         console.error('Form submission error:', error);
         sendGAEvent('event', 'form_submission', {
            form_category: 'CallbackForm',
            form_action: 'Error',
         });
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
               {TRANSLATED_VALUES[locale]?.commons?.getCallback}
            </p>
            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='fullName' className='text-sm font-semibold'>
                     {TRANSLATED_VALUES[locale]?.contact?.fullName}*
                  </label>
                  <input
                     type='text'
                     id='fullName'
                     name='fullName'
                     required
                     value={formFields.fullName}
                     onChange={handleInputChange}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.contact?.enterYourFullName
                     }
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
                     {TRANSLATED_VALUES[locale]?.contact?.businessEmail}*
                  </label>
                  <input
                     type='businessEmail'
                     id='businessEmail'
                     name='businessEmail'
                     required
                     value={formFields.businessEmail}
                     onChange={handleInputChange}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.contact
                           ?.enterYourBusinessEmail
                     }
                     className='rounded-md border border-s-300 p-2 text-sm md:text-base'
                  />
               </div>

               <div className='flex flex-col gap-1'>
                  <label htmlFor='country' className='text-sm font-semibold'>
                     {TRANSLATED_VALUES[locale]?.contact?.country}*
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
                        {TRANSLATED_VALUES[locale]?.contact?.selectYourCountry}
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
                     {TRANSLATED_VALUES[locale]?.contact?.message}*
                  </label>
                  <textarea
                     id='message'
                     name='message'
                     required
                     value={formFields.message}
                     onChange={handleInputChange}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.contact?.enterYourMessage
                     }
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
                     {TRANSLATED_VALUES[locale]?.contact?.successMessage}
                  </div>
               ) : null}

               <div>
                  <Button
                     className='mt-4 w-full'
                     variant='secondary'
                     type='submit'
                     disabled={isSubmitting}
                  >
                     {isSubmitting
                        ? TRANSLATED_VALUES[locale]?.contact?.sending
                        : TRANSLATED_VALUES[locale]?.contact?.sendMessage}
                  </Button>
               </div>
            </form>
         </div>
      </>
   );
};

export default GetCallBackForm;
