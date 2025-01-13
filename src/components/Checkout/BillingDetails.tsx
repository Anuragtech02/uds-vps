'use client';

import { useState, useEffect } from 'react';
import Button from '../commons/Button';
import CustomPhoneInput from '../CustomPhoneInput';
import { useCheckout } from '@/utils/CheckoutContext';

interface State {
   name: string;
   code: string;
}

interface Country {
   name: string;
   code: string;
   states: State[];
}

interface BillingFormData {
   firstName: string;
   lastName: string;
   email: string;
   country: string;
   state: string;
   city: string;
   address: string;
   orderNotes?: string;
}

const BillingDetails = () => {
   const [countries, setCountries] = useState<Country[]>([]);
   const [states, setStates] = useState<State[]>([]);
   const [loadingCountries, setLoadingCountries] = useState(false);
   const [loadingStates, setLoadingStates] = useState(false);
   const [touched, setTouched] = useState<
      Partial<Record<keyof BillingFormData, boolean>>
   >({});

   const { formData, setFormData, phone, setPhone, errors, setErrors } =
      useCheckout();

   useEffect(() => {
      const fetchCountries = async () => {
         setLoadingCountries(true);
         try {
            // Using a reliable country-state API
            const response = await fetch(
               'https://countriesnow.space/api/v0.1/countries/states',
            );
            const data = await response.json();
            const formattedCountries = data.data.map((country: any) => ({
               name: country.name,
               code: country.iso3,
               states: country.states.map((state: any) => ({
                  name: state.name,
                  code: state.state_code || state.name,
               })),
            }));
            setCountries(formattedCountries);
         } catch (error) {
            console.error('Error fetching countries:', error);
         } finally {
            setLoadingCountries(false);
         }
      };

      fetchCountries();
   }, []);

   const handleCountryChange = (value: string) => {
      // Update the country in form data
      // @ts-ignore
      setFormData((prev) => ({
         ...prev,
         country: value,
         state: '', // Reset state when country changes
      }));

      // Update available states based on selected country
      const selectedCountry = countries.find((c) => c.code === value);
      if (selectedCountry) {
         setStates(selectedCountry.states);
      } else {
         setStates([]);
      }

      // Validate if the field was touched
      if (touched.country) {
         validateField('country', value);
      }
   };

   const validateField = (name: keyof BillingFormData, value: string) => {
      let error: string | undefined;

      switch (name) {
         case 'firstName':
         case 'lastName':
            if (!value.trim()) {
               error = 'This field is required';
            } else if (value.length < 2) {
               error = 'Must be at least 2 characters';
            } else if (!/^[a-zA-Z\s]*$/.test(value)) {
               error = 'Only letters are allowed';
            }
            break;

         case 'email':
            if (!value) {
               error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
               error = 'Enter a valid email address';
            }
            break;

         case 'address':
            if (!value.trim()) {
               error = 'Address is required';
            } else if (value.length < 10) {
               error = 'Address must be at least 10 characters long';
            }
            break;

         case 'country':
         case 'state':
         case 'city':
            if (!value.trim()) {
               error = 'This field is required';
            }
            break;
      }

      // @ts-ignore
      setErrors((prev) => ({
         ...prev,
         [name]: error,
      }));

      return !error;
   };

   const handleChange = (name: keyof BillingFormData, value: string) => {
      setFormData({
         ...formData,
         [name]: value,
      });

      // Validate on change if the field has been touched
      if (touched[name]) {
         validateField(name, value);
      }
   };

   const handleBlur = (name: keyof BillingFormData) => {
      setTouched((prev) => ({
         ...prev,
         [name]: true,
      }));
      // @ts-ignore
      validateField(name, formData[name]);
   };

   const inputClassName = (hasError: boolean) => `
  w-full rounded-md border p-3
  ${
     hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-s-300 focus:border-blue-500 focus:ring-blue-500'
  }
`;

   return (
      <div>
         <div className='space-y-6 text-sm md:space-y-8'>
            <p className='text-2xl font-bold text-s-600'>Billing Details</p>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='first-name'>First Name*</label>
                  <input
                     type='text'
                     id='first-name'
                     value={formData.firstName}
                     onChange={(e) => handleChange('firstName', e.target.value)}
                     onBlur={() => handleBlur('firstName')}
                     placeholder='Enter your first name'
                     className={inputClassName(
                        !!errors.firstName && !!touched.firstName,
                     )}
                  />
                  {errors.firstName && touched.firstName && (
                     <p className='mt-1 text-sm text-red-500'>
                        {errors.firstName}
                     </p>
                  )}
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='last-name'>Last Name*</label>
                  <input
                     type='text'
                     id='last-name'
                     value={formData.lastName}
                     onChange={(e) => handleChange('lastName', e.target.value)}
                     onBlur={() => handleBlur('lastName')}
                     placeholder='Enter your last name'
                     className={inputClassName(
                        !!errors.lastName && !!touched.lastName,
                     )}
                  />
                  {errors.lastName && touched.lastName && (
                     <p className='mt-1 text-sm text-red-500'>
                        {errors.lastName}
                     </p>
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0'>
                  <CustomPhoneInput
                     value={phone}
                     onChange={(value: string) => setPhone(value)}
                     required
                  />
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='email'>Email*</label>
                  <input
                     type='email'
                     id='email'
                     value={formData.email}
                     onChange={(e) => handleChange('email', e.target.value)}
                     onBlur={() => handleBlur('email')}
                     placeholder='Enter your email'
                     className={inputClassName(
                        !!errors.email && !!touched.email,
                     )}
                  />
                  {errors.email && touched.email && (
                     <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='country'>Country/Region*</label>
                  <select
                     id='country'
                     value={formData.country}
                     onChange={(e) => handleCountryChange(e.target.value)}
                     onBlur={() => handleBlur('country')}
                     className={inputClassName(
                        !!errors.country && !!touched.country,
                     )}
                     disabled={loadingCountries}
                  >
                     <option value=''>
                        {loadingCountries
                           ? 'Loading countries...'
                           : 'Select your country'}
                     </option>
                     {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                           {country.name}
                        </option>
                     ))}
                  </select>
                  {errors.country && touched.country && (
                     <p className='mt-1 text-sm text-red-500'>
                        {errors.country}
                     </p>
                  )}
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='state'>State*</label>
                  <select
                     id='state'
                     value={formData.state}
                     onChange={(e) => handleChange('state', e.target.value)}
                     onBlur={() => handleBlur('state')}
                     className={inputClassName(
                        !!errors.state && !!touched.state,
                     )}
                     disabled={!formData.country || loadingStates}
                  >
                     <option value=''>
                        {!formData.country
                           ? 'Select a country first'
                           : loadingStates
                             ? 'Loading states...'
                             : 'Select your state'}
                     </option>
                     {states.map((state) => (
                        <option key={state.code} value={state.code}>
                           {state.name}
                        </option>
                     ))}
                  </select>
                  {errors.state && touched.state && (
                     <p className='mt-1 text-sm text-red-500'>{errors.state}</p>
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='city'>Town/City*</label>
                  <input
                     type='text'
                     id='city'
                     value={formData.city}
                     onChange={(e) => handleChange('city', e.target.value)}
                     onBlur={() => handleBlur('city')}
                     placeholder='Enter your city'
                     className={inputClassName(!!errors.city && !!touched.city)}
                  />
                  {errors.city && touched.city && (
                     <p className='mt-1 text-sm text-red-500'>{errors.city}</p>
                  )}
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='address'>Street Address*</label>
                  <input
                     type='text'
                     id='address'
                     value={formData.address}
                     onChange={(e) => handleChange('address', e.target.value)}
                     onBlur={() => handleBlur('address')}
                     placeholder='Enter your street address'
                     className={inputClassName(
                        !!errors.address && !!touched.address,
                     )}
                  />
                  {errors.address && touched.address && (
                     <p className='mt-1 text-sm text-red-500'>
                        {errors.address}
                     </p>
                  )}
               </div>
            </div>

            <div className='space-y-1'>
               <label htmlFor='orderNotes'>Order notes (optional)</label>
               <textarea
                  id='orderNotes'
                  value={formData.orderNotes}
                  onChange={(e) => handleChange('orderNotes', e.target.value)}
                  placeholder='Notes about your order, e.g. special notes for delivery.'
                  className='min-h-32 w-full rounded-md border border-s-300 p-3'
               />
            </div>
         </div>
         {/* Assistance Section */}
         <div className='mt-6 hidden w-full rounded-xl bg-white p-6 sm:block'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-800'>
               Need assistance?
            </h2>
            <p className='mb-4 font-bold text-gray-600'>
               Call us or write to us:
            </p>
            <div className='space-y-2'>
               <p className='text-gray-700'>
                  <span className='font-medium'>Phone:</span>{' '}
                  <a
                     href='tel:+1-888-689-0688'
                     className='font-bold text-blue-600 hover:text-blue-800'
                  >
                     +1 978 733 0253
                  </a>
               </p>
               <p className='text-gray-700'>
                  <span className='font-medium'>Email:</span>{' '}
                  <a
                     href='mailto:sales@univdatos.com'
                     className='font-bold text-blue-600 hover:text-blue-800'
                  >
                     sales@univdatos.com
                  </a>
               </p>
            </div>
         </div>
      </div>
   );
};

export default BillingDetails;
