import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputProps {
   value: string;
   onChange: (phone: string) => void;
   label?: string;
   required?: boolean;
   error?: string;
   locale?: string;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
   value,
   onChange,
   label = 'Mobile Number',
   required = false,
   error,
   locale = 'en',
}) => {
   const [countryCode, setCountryCode] = useState('us');
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const detectCountry = async () => {
         try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.country_code) {
               setCountryCode(data.country_code.toLowerCase());
            }
         } catch (error) {
            console.error('Error detecting country:', error);
            // Fallback to US if detection fails
            setCountryCode('us');
         } finally {
            setIsLoading(false);
         }
      };

      detectCountry();
   }, []);

   if (isLoading) {
      return (
         <div className='h-full w-full space-y-1'>
            <label
               htmlFor='phone-input'
               className='block text-sm font-medium text-gray-700'
            >
               {TRANSLATED_VALUES[locale]?.contact.mobileNumber}
               {required && '*'}
            </label>
            <div className='h-12 w-full animate-pulse rounded-md bg-gray-100' />
         </div>
      );
   }

   return (
      <div className='h-full w-full space-y-1'>
         <label
            htmlFor='phone-input'
            className='block text-sm font-medium text-gray-700'
         >
            {TRANSLATED_VALUES[locale]?.contact.mobileNumber}
            {required && '*'}
         </label>
         <PhoneInput
            country={countryCode}
            value={value}
            onChange={(phone) => onChange(phone)}
            inputProps={{
               id: 'phone-input',
               required: required,
            }}
            containerClass='w-full'
            inputClass='!w-full rounded-md border border-s-300 p-3 py-5 pl-12 h-full'
            buttonClass='rounded-l-md border border-s-300'
            enableSearch
            searchClass='!w-full'
         />
         {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
   );
};

export default CustomPhoneInput;
