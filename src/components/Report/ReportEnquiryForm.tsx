'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import Button from '../commons/Button';
import Script from 'next/script';
import { submitForm } from '@/utils/api/csr-services';
import countryList from '@/assets/utils/countries.json';

interface ReportEnquiryFormProps {
   reportId: number;
   reportTitle: string;
   isOpen?: boolean; // Add this prop to track popup state
}

declare global {
   interface Window {
      turnstile: {
         render: (container: string | HTMLElement, options: any) => string;
         reset: (widgetId: string) => void;
         remove: (widgetId: string) => void;
      };
      onloadTurnstileCallback: () => void;
   }
}

const ReportEnquiryForm: React.FC<ReportEnquiryFormProps> = ({
   reportId,
   reportTitle,
   isOpen = true,
}) => {
   const [formFields, setFormFields] = useState({
      fullName: '',
      businessEmail: '',
      company: '',
      message: '',
      country: '',
   });
   const [phone, setPhone] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   const [turnstileToken, setTurnstileToken] = useState<string>('');
   const widgetIdRef = useRef<string>('');
   const turnstileContainerId = `turnstile-container-${reportId}`; // Unique container ID

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

   // Handle initial load and reopens
   useEffect(() => {
      if (isOpen) {
         // Reset states
         setTurnstileToken('');
         setSubmitError(null);
         setSubmitSuccess(false);

         // Set up Turnstile callback
         window.onloadTurnstileCallback = initializeTurnstile;

         // If Turnstile is already loaded, initialize immediately
         if (window.turnstile) {
            initializeTurnstile();
         }
      }

      return () => {
         cleanupTurnstile();
         // @ts-expect-error - window.onloadTurnstileCallback is defined
         delete window.onloadTurnstileCallback;
      };
   }, [isOpen]);

   // Rest of the component remains the same...
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
         report: reportId,
      };

      try {
         const response = await submitForm('enquiry', {
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
            company: '',
            message: '',
            country: '',
         });
         setPhone('');
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

         <div className='max-h-[80vh] overflow-y-auto pt-6 font-medium'>
            <p>
               Requesting For: <strong>{reportTitle}</strong>
            </p>
            <hr className='mb-4 mt-2' />
            <form
               onSubmit={handleSubmit}
               className='relative mt-2 space-y-4 text-sm md:space-y-4'
            >
               <div className='flex flex-col gap-4 sm:items-center md:flex-row'>
                  <div className='w-full shrink grow basis-0 space-y-1 sm:w-auto'>
                     <label htmlFor='name'>Full Name*</label>
                     <input
                        type='text'
                        id='fullName'
                        name='fullName'
                        required
                        value={formFields.fullName}
                        onChange={handleInputChange}
                        placeholder='Enter your full name'
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
                  <div className='w-full shrink grow basis-0 space-y-1 sm:w-auto'>
                     <CustomPhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                     />
                  </div>
               </div>
               <div className='flex flex-col items-center gap-4 md:flex-row'>
                  <div className='w-full shrink grow basis-0 space-y-1 sm:w-auto'>
                     <label htmlFor='email'>Business Email*</label>
                     <input
                        type='email'
                        id='businessEmail'
                        name='businessEmail'
                        required
                        value={formFields.businessEmail}
                        onChange={handleInputChange}
                        placeholder='Enter your email'
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
                  <div className='w-full shrink grow basis-0 space-y-1 sm:w-auto'>
                     <label htmlFor='company'>Company*</label>
                     <input
                        type='text'
                        id='company'
                        name='company'
                        required
                        value={formFields.company}
                        onChange={handleInputChange}
                        placeholder='Enter your company name'
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
               </div>

               <div className='space-y-1'>
                  <label htmlFor='country'>Country</label>
                  <select
                     id='country'
                     name='country'
                     value={formFields.country}
                     onChange={handleInputChange}
                     className='w-full rounded-md border border-s-300 p-3'
                  >
                     <option className='opacity-50' value=''>
                        Select your country
                     </option>
                     {countryList?.map((country) => (
                        <option key={country.code} value={country.name}>
                           {country.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div className='space-y-1'>
                  <label htmlFor='message'>Message</label>
                  <textarea
                     name='message'
                     id='message'
                     value={formFields.message}
                     onChange={handleInputChange}
                     placeholder='Enter your message or any specific requirements'
                     className='min-h-20 w-full rounded-md border border-s-300 p-3'
                  ></textarea>
               </div>

               {/* Cloudflare Turnstile */}
               <div className='space-y-2 pb-1'>
                  <div id={turnstileContainerId}></div>
               </div>
               {/* <div className='h-20'></div> */}

               {submitError && <p className='text-red-500'>{submitError}</p>}
               {submitSuccess && (
                  <p className='text-green-500'>
                     Thank you for your enquiry. We&apos;ll get back to you
                     soon!
                  </p>
               )}
               <div className='sticky bottom-0 w-full'>
                  <Button
                     className='w-full !bg-blue-1 text-white'
                     type='submit'
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Submitting...' : 'Get Sample on Email'}
                  </Button>
               </div>
            </form>
         </div>
      </>
   );
};

export default ReportEnquiryForm;
