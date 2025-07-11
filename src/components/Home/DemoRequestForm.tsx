'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import { submitForm } from '@/utils/api/csr-services';
import Button from '../commons/Button';
import Script from 'next/script';
import { sendGAEvent } from '@next/third-parties/google';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

const DemoRequestForm = () => {
   const [formFields, setFormFields] = useState({
      fullName: '',
      businessEmail: '',
      company: '',
      message: '',
   });
   const [phone, setPhone] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   const [turnstileToken, setTurnstileToken] = useState<string>('');
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
         form_category: 'DemoRequestForm',
         form_action: 'Initiate',
      });

      try {
         const response = await submitForm('demo', {
            ...formFields,
            mobile: phone,
            rawData: { ...requestData, cfTurnstileResponse: turnstileToken },
         });

         setSubmitSuccess(true);
         // Reset form fields
         setFormFields({
            fullName: '',
            businessEmail: '',
            company: '',
            message: '',
         });
         setPhone('');
         setSubmitError(null); // Ensure error is cleared on success
         // Reset Turnstile
         setTimeout(() => {
            setSubmitSuccess(false);
         }, 5000); // Reset success message after 5 seconds
         // sendGAEvent('event', 'form_submission', {
         //    form_category: 'DemoRequestForm',
         //    form_action: 'Submit',
         // });
         sendGAEvent({
            event: 'form_submission',
            value: `DemoRequestForm_Submit: ${JSON.stringify(requestData)}`,
         });
         // Reset Turnstile after successful submission
         if (window.turnstile) {
            window.turnstile.reset('#callback-turnstile-container');
         }
      } catch (error) {
         setSubmitError('An error occurred. Please try again.');
         setSubmitSuccess(false); // Ensure success is cleared on error
         console.error(error); // Changed to console.error for better debugging
         sendGAEvent('event', 'form_submission', {
            form_category: 'DemoRequestForm',
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

         <div className='rounded-xl bg-white pt-6 font-medium text-[#020D19]'>
            <form
               onSubmit={handleSubmit}
               className='space-y-6 text-sm md:space-y-8'
            >
               <div className='flex flex-col items-center gap-4 md:flex-row [&>div]:w-full sm:[&>div]:w-auto'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='name'>
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
                        required
                        locale={locale}
                     />
                  </div>
               </div>
               <div className='flex flex-col items-center gap-4 md:flex-row [&>div]:w-full sm:[&>div]:w-auto'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='email'>
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
                     className='min-h-24 w-full rounded-md border border-s-300 p-3'
                  ></textarea>
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
                     {TRANSLATED_VALUES[locale]?.contact.thankYouMessage}
                  </div>
               ) : null}
               <div>
                  <Button
                     className='w-full !bg-blue-1 text-white'
                     type='submit'
                     disabled={isSubmitting}
                  >
                     {isSubmitting
                        ? TRANSLATED_VALUES[locale]?.contact.submitting
                        : TRANSLATED_VALUES[locale]?.contact.getSampleOnEmail}
                  </Button>
               </div>
            </form>
         </div>
      </>
   );
};

export default DemoRequestForm;
