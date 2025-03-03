'use client';
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import Button from '../commons/Button';
import Script from 'next/script';
import { submitForm } from '@/utils/api/csr-services';
import countryList from '@/assets/utils/countries.json';
import { sendGAEvent } from '@next/third-parties/google';

interface ReportEnquiryFormProps {
   reportId: number;
   reportTitle: string;
   isOpen?: boolean;
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
   const turnstileContainerId = `turnstile-container-${reportId}`;

   // ... (keeping all the existing Turnstile-related functions)
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

      const container = document.getElementById(turnstileContainerId);
      if (!container || !window.turnstile) return;

      try {
         const newWidgetId = window.turnstile.render(
            `#${turnstileContainerId}`,
            {
               sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
               callback: function (token: string) {
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
      if (isOpen) {
         setTurnstileToken('');
         setSubmitError(null);
         setSubmitSuccess(false);

         window.onloadTurnstileCallback = initializeTurnstile;

         if (window.turnstile) {
            initializeTurnstile();
         }
      }

      return () => {
         cleanupTurnstile();
         // @ts-ignore
         delete window.onloadTurnstileCallback;
      };
   }, [isOpen]);

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

   const handleCloseSuccess = () => {
      setSubmitSuccess(false);
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

      sendGAEvent('event', 'form_initiation', {
         form_category: 'EnquiryForm',
         form_action: 'Initiate',
         form_label: reportTitle,
      });

      try {
         const response = await submitForm('enquiry', {
            ...requestData,
            rawData: {
               ...requestData,
               cfTurnstileResponse: turnstileToken,
            },
         });

         setSubmitSuccess(true);
         setFormFields({
            fullName: '',
            businessEmail: '',
            company: '',
            message: '',
            country: '',
         });
         setPhone('');
         // sendGAEvent('event', 'form_initiation', {
         //    form_category: 'EnquiryForm',
         //    form_action: 'Submit',
         //    form_label: reportTitle,
         // });
         sendGAEvent({
            event: 'form_submission',
            value: reportTitle,
         });
      } catch (error) {
         setSubmitError('An error occurred. Please try again.');
         sendGAEvent('event', 'form_error', {
            form_category: 'EnquiryForm',
            form_action: 'Error',
            form_label: reportTitle,
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <div className='relative max-h-[80vh] overflow-y-auto pt-6 font-medium'>
            {submitSuccess && (
               <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
                     <button
                        onClick={handleCloseSuccess}
                        className='absolute right-3 top-3 rounded-full p-2 transition-colors hover:bg-gray-100'
                     >
                        X
                     </button>

                     <div className='text-center'>
                        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                           <svg
                              className='h-6 w-6 text-green-500'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                           >
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth='2'
                                 d='M5 13l4 4L19 7'
                              />
                           </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                           Success!
                        </h3>
                        <p className='text-gray-600'>
                           Thank you for your enquiry. We&apos;ll get back to
                           you soon!
                        </p>
                     </div>
                  </div>
               </div>
            )}

            <p>
               Requesting For: <strong>{reportTitle}</strong>
            </p>
            <hr className='mb-4 mt-2' />
            <form
               onSubmit={handleSubmit}
               className='relative mt-2 space-y-4 text-sm md:space-y-4'
            >
               {/* Form fields */}
               <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                  <div className='space-y-1'>
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

                  <div className='space-y-1'>
                     <CustomPhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                     />
                  </div>

                  <div className='space-y-1'>
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

                  <div className='space-y-1'>
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

               <div className='space-y-2 pb-1'>
                  <div id={turnstileContainerId}></div>
               </div>

               {submitError && <p className='text-red-500'>{submitError}</p>}

               <div className='w-full'>
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
         <Script
            src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
            async
            defer
         />
      </>
   );
};

export default ReportEnquiryForm;
