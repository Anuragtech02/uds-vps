'use client';
import { useState, FormEvent, useEffect } from 'react';
import Button from './Button';
import Script from 'next/script';
import countryList from '@/assets/utils/countries.json';
import { submitForm } from '@/utils/api/csr-services';
import CustomPhoneInput from '../CustomPhoneInput';

declare global {
   interface Window {
      turnstile: {
         render: (container: string | HTMLElement, options: any) => string;
         reset: (widgetId: string) => void;
      };
      onloadTurnstileCallback: () => void;
   }
}

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

   useEffect(() => {
      window.onloadTurnstileCallback = function () {
         window.turnstile.render('#turnstile-container', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
            callback: function (token: string) {
               console.log('Challenge Success', token);
               setTurnstileToken(token);
               setSubmitError(null);
            },
            'expired-callback': function () {
               setTurnstileToken('');
               setSubmitError('Verification expired. Please verify again.');
            },
            'error-callback': function () {
               setSubmitError('Error during verification. Please try again.');
            },
         });
      };

      return () => {
         // @ts-expect-error - Property 'onloadTurnstileCallback' does not exist on type 'Window'
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
         // Reset form fields
         setFormFields({
            fullName: '',
            businessEmail: '',
            country: '',
            message: '',
         });
         // Reset Turnstile
         if (window.turnstile) {
            window.turnstile.reset('#turnstile-container');
         }
      } catch (error) {
         setSubmitError('An error occurred. Please try again.');
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
                  <div id='turnstile-container'></div>
               </div>

               {submitError && (
                  <p className='text-sm text-red-500'>{submitError}</p>
               )}
               {submitSuccess && (
                  <p className='text-sm text-green-500'>
                     Thank you! We&apos;ll get back to you shortly.
                  </p>
               )}

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
