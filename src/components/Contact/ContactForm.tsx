'use client';
import { useState, useEffect } from 'react';
import Button from '../commons/Button';
import CustomPhoneInput from '../CustomPhoneInput';
import countryList from '@/assets/utils/countries.json';
import Script from 'next/script';

declare global {
   interface Window {
      turnstile: {
         render: (container: string | HTMLElement, options: any) => string;
         reset: (widgetId: string) => void;
      };
      onloadTurnstileCallback: () => void;
   }
}

const ContactForm = () => {
   const [formFields, setFormFields] = useState({
      name: '',
      email: '',
      message: '',
      country: '',
   });
   const [phone, setPhone] = useState('');
   const [turnstileToken, setTurnstileToken] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);

   useEffect(() => {
      // Define the callback function that will be called when Turnstile is loaded
      window.onloadTurnstileCallback = function () {
         window.turnstile.render('#turnstile-container', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
            callback: function (token: string) {
               console.log('Challenge Success', token);
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
         });
      };

      return () => {
         // Clean up the global callback
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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!turnstileToken) {
         setError('Please complete the verification');
         return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
         const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               ...formFields,
               phone,
               cfTurnstileResponse: turnstileToken,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to submit form');
         }

         setSuccess(true);
         setFormFields({ name: '', email: '', message: '', country: '' });
         setPhone('');
         // Reset Turnstile after successful submission
         if (window.turnstile) {
            window.turnstile.reset('#turnstile-container');
         }
      } catch (error) {
         setError('Failed to send message. Please try again.');
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
               <p className='text-[1.625rem] text-blue-1'>Get in Touch</p>

               <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                  <div className='shrink grow basis-0 space-y-1'>
                     <label htmlFor='name'>Full Name*</label>
                     <input
                        type='text'
                        id='name'
                        name='name'
                        required
                        value={formFields.name}
                        onChange={handleInputChange}
                        placeholder='Enter your full name'
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
                     <label htmlFor='email'>Business Email*</label>
                     <input
                        type='email'
                        id='email'
                        name='email'
                        required
                        value={formFields.email}
                        onChange={handleInputChange}
                        placeholder='Enter your email'
                        className='w-full rounded-md border border-s-300 p-3'
                     />
                  </div>
                  <div className='shrink grow basis-0 space-y-1'>
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
                     placeholder='Enter your message'
                     className='min-h-32 w-full rounded-md border border-s-300 p-3'
                  />
               </div>

               {/* Cloudflare Turnstile */}
               <div className='space-y-2'>
                  <div id='turnstile-container'></div>
                  {error && <p className='text-sm text-red-500'>{error}</p>}
               </div>

               {success && (
                  <div className='rounded-md bg-green-50 p-4 text-green-800'>
                     Thank you! Your message has been sent successfully.
                  </div>
               )}

               <div>
                  <Button
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

export default ContactForm;
