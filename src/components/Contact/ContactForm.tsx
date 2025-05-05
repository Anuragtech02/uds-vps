'use client';
import { useState, useEffect, useRef } from 'react';
import Button from '../commons/Button';
import CustomPhoneInput from '../CustomPhoneInput';
import countryList from '@/assets/utils/countries.json';
import Script from 'next/script';
import { submitForm } from '@/utils/api/csr-services';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

const ContactForm = () => {
   const [formFields, setFormFields] = useState({
      fullName: '',
      businessEmail: '',
      company: '',
      message: '',
      country: '',
   });
   const [phone, setPhone] = useState('');
   const [turnstileToken, setTurnstileToken] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);
   const widgetIdRef = useRef<string>('');
   const turnstileContainerId = 'turnstile-container'; // Keep this consistent

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
                  setTurnstileToken(token);
                  setError(null);
               },
               'expired-callback': function () {
                  setTurnstileToken('');
                  setError('Verification expired. Please verify again.');
               },
               'error-callback': function () {
                  setError('Error during verification. Please try again.');
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
         // Remove the callback
         if (window.onloadTurnstileCallback) {
            // @ts-expect-error - window.onloadTurnstileCallback is defined
            delete window.onloadTurnstileCallback;
         }
      };
   }, []); // Empty dependency array since we only want this to run once

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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!turnstileToken) {
         setError('Please complete the verification');
         setSuccess(false); // Reset success state when there's an error
         return;
      }

      setIsSubmitting(true);
      setError(null);
      setSuccess(false); // Reset success state at the start

      const requestData = {
         ...formFields,
         mobileNumber: phone,
      };

      try {
         const response = await submitForm('contact', {
            ...requestData,
            rawData: {
               ...requestData,
               cfTurnstileResponse: turnstileToken,
            },
         });

         setSuccess(true);
         setFormFields({
            fullName: '',
            businessEmail: '',
            message: '',
            country: '',
            company: '',
         });
         setPhone('');
         setError(null); // Ensure error is cleared on success

         setTimeout(() => {
            setSuccess(false);
         }, 5000); // Reset success message after 5 seconds
         // Reset Turnstile after successful submission
         if (window.turnstile) {
            window.turnstile.reset('#turnstile-container');
         }
      } catch (error) {
         setSuccess(false); // Ensure success is cleared on error
         setError('Failed to send message. Please try again.');
         console.error(error); // Changed to console.error for better debugging
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

         <div className='w-full rounded-xl bg-white p-4 font-medium text-[#020D19] md:p-6'>
            <form
               onSubmit={handleSubmit}
               className='space-y-6 text-sm md:space-y-8'
            >
               <p className='text-[1.625rem] text-blue-1'>
                  {TRANSLATED_VALUES[locale]?.contact.getInTouch}
               </p>

               <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='fullName'>
                        {' '}
                        {TRANSLATED_VALUES[locale]?.contact.fullName}*
                     </label>
                     <input
                        type='text'
                        id='fullName'
                        name='fullName'
                        required
                        value={formFields.fullName}
                        onChange={handleInputChange}
                        placeholder={
                           TRANSLATED_VALUES[locale]?.contact.enterYourFullName
                        }
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
                  <div className='shrink grow basis-0 space-y-1'>
                     <CustomPhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                     />
                  </div>
               </div>

               <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='businessEmail'>
                        {TRANSLATED_VALUES[locale]?.contact.businessEmail}*
                     </label>
                     <input
                        type='email'
                        id='businessEmail'
                        name='businessEmail'
                        required
                        value={formFields.businessEmail}
                        onChange={handleInputChange}
                        placeholder={
                           TRANSLATED_VALUES[locale]?.contact
                              .enterYourBusinessEmail
                        }
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='country'>
                        {TRANSLATED_VALUES[locale]?.contact.country}
                     </label>
                     <select
                        id='country'
                        name='country'
                        value={formFields.country}
                        onChange={handleInputChange}
                        className='w-full rounded-md border border-s-300 p-3'
                     >
                        <option className='opacity-50' value=''>
                           {
                              TRANSLATED_VALUES[locale]?.contact
                                 .selectYourCountry
                           }
                        </option>
                        {countryList?.map((country) => (
                           <option key={country.code} value={country.name}>
                              {country.name}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='company'>
                        {TRANSLATED_VALUES[locale]?.contact.company}*
                     </label>
                     <input
                        type='text'
                        id='company'
                        name='company'
                        required
                        value={formFields.company}
                        onChange={handleInputChange}
                        placeholder={
                           TRANSLATED_VALUES[locale]?.contact.enterYourCompany
                        }
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
               </div>

               <div className='space-y-1'>
                  <label htmlFor='message'>
                     {TRANSLATED_VALUES[locale]?.contact.message}
                  </label>
                  <textarea
                     name='message'
                     id='message'
                     value={formFields.message}
                     onChange={handleInputChange}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.contact.enterYourMessage
                     }
                     className='min-h-32 w-full rounded-md border border-s-300 p-3'
                  />
               </div>

               <div className='flex flex-col items-center justify-between sm:flex-row'>
                  <div className='flex flex-col items-start'>
                     <div id={turnstileContainerId}></div>

                     {/* Cloudflare Turnstile */}
                     {error ? (
                        <div className='rounded-md bg-red-50 p-4 text-red-800'>
                           {error}
                        </div>
                     ) : success ? (
                        <div className='rounded-md bg-green-50 p-4 text-green-800'>
                           Thank you! Your message has been sent successfully.
                        </div>
                     ) : null}
                  </div>

                  <div>
                     <Button
                        variant='secondary'
                        type='submit'
                        disabled={isSubmitting}
                     >
                        {isSubmitting
                           ? 'Sending...'
                           : TRANSLATED_VALUES[locale]?.contact.sendMessage}
                     </Button>
                  </div>
               </div>
            </form>
         </div>
      </>
   );
};

export default ContactForm;
