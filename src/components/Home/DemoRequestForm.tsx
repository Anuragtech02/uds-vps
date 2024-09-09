"use client";
import { useState, FormEvent, useCallback } from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { submitContactForm } from '@/utils/api/csr-services';

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
   const [captchaToken, setCaptchaToken] = useState<string | null>(null);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormFields({
         ...formFields,
         [e.target.name]: e.target.value,
      });
   };

   const handlePhoneChange = (phone: string) => {
      setPhone(phone);
   };

   const handleVerify = useCallback((token: string) => {
      setCaptchaToken(token);
   }, []);

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      if (!captchaToken) {
         setSubmitError('reCAPTCHA verification failed. Please try again.');
         setIsSubmitting(false);
         return;
      }

      try {
         // Replace this with your actual API call
         const response = await submitContactForm({
            ...formFields,
            mobileNumber: phone,
            captchaToken,
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
         // Reset CAPTCHA token
         setCaptchaToken(null);
      } catch (error) {
         setSubmitError('An error occurred. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}>
         <div className='rounded-xl bg-white font-medium text-[#020D19] pt-6'>
            <form onSubmit={handleSubmit} className='space-y-6 text-sm md:space-y-8'>
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
                     <CustomPhoneInput value={phone} onChange={handlePhoneChange} required />
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
               <GoogleReCaptcha onVerify={handleVerify} refreshReCaptcha />
               {submitError && <p className="text-red-500">{submitError}</p>}
               {submitSuccess && <p className="text-green-500">Thank you for your demo request. We&apos;ll get back to you soon!</p>}
               <div>
                  <button className='bg-blue-2 px-4 py-2 text-white rounded-md' type="submit" disabled={isSubmitting}>
                     {isSubmitting ? 'Submitting...' : 'Request Demo'}
                  </button>
               </div>
            </form>
         </div>
      </GoogleReCaptchaProvider>
   );
};

export default DemoRequestForm;