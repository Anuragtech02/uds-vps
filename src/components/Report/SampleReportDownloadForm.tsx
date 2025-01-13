'use client';
import { useState, FormEvent, useEffect } from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import { submitContactForm } from '@/utils/api/csr-services';
import Button from '../commons/Button';
import Script from 'next/script';

interface SampleReportDownloadFormProps {
   reportId: number;
   reportTitle: string;
}

declare global {
   interface Window {
      turnstile: {
         render: (container: string | HTMLElement, options: any) => string;
         reset: (widgetId: string) => void;
      };
      onloadTurnstileCallback: () => void;
   }
}

const SampleReportDownloadForm: React.FC<SampleReportDownloadFormProps> = ({
   reportId,
   reportTitle,
}) => {
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

      try {
         const response = await submitContactForm({
            ...formFields,
            mobileNumber: phone,
            reportId,
            cfTurnstileResponse: turnstileToken,
         });

         if (!response.ok) {
            throw new Error('Failed to submit form');
         }

         setSubmitSuccess(true);
         // Reset form fields
         setFormFields({
            fullName: '',
            businessEmail: '',
            company: '',
            message: '',
         });
         setPhone('');
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

         <div className='pt-6 font-medium'>
            <p>
               Requesting For: <strong>{reportTitle}</strong>
            </p>
            <hr className='mb-4 mt-2' />
            <form
               onSubmit={handleSubmit}
               className='mt-2 space-y-6 text-sm md:space-y-8'
            >
               <div className='flex flex-col items-center gap-4 md:flex-row'>
                  <div className='shrink grow basis-0 space-y-1'>
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
                  <div className='shrink grow basis-0 space-y-1'>
                     <CustomPhoneInput
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                     />
                  </div>
               </div>
               <div className='flex flex-col items-center gap-4 md:flex-row'>
                  <div className='shrink grow basis-0 space-y-1'>
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
                  <div className='shrink grow basis-0 space-y-1'>
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
                  <label htmlFor='message'>Message</label>
                  <textarea
                     name='message'
                     id='message'
                     value={formFields.message}
                     onChange={handleInputChange}
                     placeholder='Enter your message or any specific requirements'
                     className='min-h-32 w-full rounded-md border border-s-300 p-3'
                  ></textarea>
               </div>

               {/* Cloudflare Turnstile */}
               <div className='space-y-2'>
                  <div id='turnstile-container'></div>
               </div>

               {submitError && <p className='text-red-500'>{submitError}</p>}
               {submitSuccess && (
                  <p className='text-green-500'>
                     Thank you for your sample report request. We&apos;ll get
                     back to you soon!
                  </p>
               )}
               <div>
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

export default SampleReportDownloadForm;
