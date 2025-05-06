'use client';

import { useState, useEffect } from 'react';
import Button from '../commons/Button';
import CustomPhoneInput from '../CustomPhoneInput';
import { useCheckout } from '@/utils/CheckoutContext';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

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
   phone: string;
}

const BillingDetails = () => {
   const [countries, setCountries] = useState<Country[]>([]);
   const [states, setStates] = useState<State[]>([]);
   const [loadingCountries, setLoadingCountries] = useState(false);
   const [loadingStates, setLoadingStates] = useState(false);
   const [hasStates, setHasStates] = useState(true);

   const { locale } = useLocale();

   const {
      formData,
      setFormData,
      errors,
      touched,
      setTouched,
      setErrors,
      setSelectedCurrency,
   } = useCheckout();

   useEffect(() => {
      const fetchCountries = async () => {
         setLoadingCountries(true);
         try {
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
      setFormData((prev) => ({
         ...prev,
         country: value,
         state: '', // Reset state when country changes
      }));

      // Set currency based on country code
      if (value === 'IND') {
         setSelectedCurrency('INR');
      } else if (value === 'USA') {
         setSelectedCurrency('USD');
      } else if (value === 'GBR') {
         setSelectedCurrency('GBP');
      } else if (value === 'JPN') {
         setSelectedCurrency('JPY');
      } else if (countries.find((c) => c.code === value)?.name.includes('EU')) {
         setSelectedCurrency('EUR');
      } else {
         setSelectedCurrency('USD');
      }

      // Update available states based on selected country
      const selectedCountry = countries.find((c) => c.code === value);
      if (selectedCountry) {
         setStates(selectedCountry.states);
         setHasStates(selectedCountry.states.length > 0);
      } else {
         setStates([]);
         setHasStates(false);
      }

      // Validate if the field was touched
      if (touched.country) {
         validateField('country', value);
      }
   };

   const validateField = (name: keyof BillingFormData, value: string) => {
      let error: string | undefined;
      const trimmedValue = value.trim();

      switch (name) {
         case 'firstName':
         case 'lastName':
            if (!trimmedValue) {
               error = TRANSLATED_VALUES[locale]?.cart.thisFieldIsRequired;
            } else if (trimmedValue.length < 2) {
               error = 'Must be at least 2 characters';
            } else if (!/^[a-zA-Z\s]*$/.test(value)) {
               error = 'Only letters are allowed';
            }
            break;

         case 'email':
            if (!trimmedValue) {
               error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
               error = 'Enter a valid email address';
            }
            break;

         case 'address':
            if (!trimmedValue) {
               error = 'Address is required';
            } else if (trimmedValue.length < 10) {
               error = 'Address must be at least 10 characters long';
            }
            break;

         case 'city':
            if (!trimmedValue) {
               error = TRANSLATED_VALUES[locale]?.cart.thisFieldIsRequired;
            }
            break;

         case 'country':
            if (!trimmedValue) {
               error = TRANSLATED_VALUES[locale]?.cart.thisFieldIsRequired;
            }
            break;

         case 'state':
            // Only validate state if the country has states
            if (hasStates && !trimmedValue) {
               error = TRANSLATED_VALUES[locale]?.cart.thisFieldIsRequired;
            }
            break;
      }

      setErrors((prev) => ({
         ...prev,
         [name]: error,
      }));

      return !error;
   };

   const handleChange = (name: keyof BillingFormData, value: string) => {
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      if (touched[name]) {
         validateField(name, value.trim());
      }
   };

   const handleBlur = (name: keyof BillingFormData) => {
      setTouched((prev) => ({
         ...prev,
         [name]: true,
      }));
      validateField(name, formData[name] || '');
   };

   const handlePhoneChange = (value: string) => {
      setFormData((prev) => ({
         ...prev,
         phone: value,
      }));

      if (touched.phone) {
         validateField('phone', value);
      }
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
            <p className='text-2xl font-bold text-s-600'>
               {TRANSLATED_VALUES[locale]?.cart.billingDetails}
            </p>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='first-name'>
                     {TRANSLATED_VALUES[locale]?.cart.firstName}*
                  </label>
                  <input
                     type='text'
                     id='first-name'
                     value={formData.firstName}
                     onChange={(e) => handleChange('firstName', e.target.value)}
                     onBlur={() => handleBlur('firstName')}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.cart.enterYourFirstName
                     }
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
                  <label htmlFor='last-name'>
                     {TRANSLATED_VALUES[locale]?.cart.lastName}*
                  </label>
                  <input
                     type='text'
                     id='last-name'
                     value={formData.lastName}
                     onChange={(e) => handleChange('lastName', e.target.value)}
                     onBlur={() => handleBlur('lastName')}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.cart.enterYourLastName
                     }
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
                     value={formData.phone}
                     onChange={handlePhoneChange}
                     required
                     locale={locale}
                  />
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='email'>
                     {TRANSLATED_VALUES[locale]?.cart.email}*
                  </label>
                  <input
                     type='email'
                     id='email'
                     value={formData.email}
                     onChange={(e) => handleChange('email', e.target.value)}
                     onBlur={() => handleBlur('email')}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.cart.enterYourEmail
                     }
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
                  <label htmlFor='country'>
                     {TRANSLATED_VALUES[locale]?.cart.countryRegion}*
                  </label>
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
                           ? TRANSLATED_VALUES[locale]?.cart.loadingCountries
                           : TRANSLATED_VALUES[locale]?.cart.selectYourCountry}
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
                  <label htmlFor='state'>
                     {TRANSLATED_VALUES[locale]?.cart.state}
                     {hasStates && '*'}
                  </label>
                  {hasStates ? (
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
                              ? TRANSLATED_VALUES[locale]?.cart
                                   .selectACountryFirst
                              : loadingStates
                                ? TRANSLATED_VALUES[locale]?.cart.loadingStates
                                : TRANSLATED_VALUES[locale]?.cart
                                     .selectYourState}
                        </option>
                        {states.map((state) => (
                           <option key={state.code} value={state.code}>
                              {state.name}
                           </option>
                        ))}
                     </select>
                  ) : (
                     <input
                        type='text'
                        id='state'
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        placeholder={
                           TRANSLATED_VALUES[locale]?.cart
                              .enterYourStateProvince
                        }
                        className={inputClassName(
                           !!errors.state && !!touched.state,
                        )}
                     />
                  )}
                  {errors.state && touched.state && (
                     <p className='mt-1 text-sm text-red-500'>{errors.state}</p>
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row lg:items-start'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='city'>
                     {TRANSLATED_VALUES[locale]?.cart.townCity}*
                  </label>
                  <input
                     type='text'
                     id='city'
                     value={formData.city}
                     onChange={(e) => handleChange('city', e.target.value)}
                     onBlur={() => handleBlur('city')}
                     placeholder={TRANSLATED_VALUES[locale]?.cart.enterYourCity}
                     className={inputClassName(!!errors.city && !!touched.city)}
                  />
                  {errors.city && touched.city && (
                     <p className='mt-1 text-sm text-red-500'>{errors.city}</p>
                  )}
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='address'>
                     {TRANSLATED_VALUES[locale]?.cart.streetAddress}*
                  </label>
                  <input
                     type='text'
                     id='address'
                     value={formData.address}
                     onChange={(e) => handleChange('address', e.target.value)}
                     onBlur={() => handleBlur('address')}
                     placeholder={
                        TRANSLATED_VALUES[locale]?.cart.enterYourStreetAddress
                     }
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
               <label htmlFor='orderNotes'>
                  {TRANSLATED_VALUES[locale]?.cart.orderNotes}
               </label>
               <textarea
                  id='orderNotes'
                  value={formData.orderNotes}
                  onChange={(e) => handleChange('orderNotes', e.target.value)}
                  placeholder={
                     TRANSLATED_VALUES[locale]?.cart.notesAboutYourOrder
                  }
                  className='min-h-32 w-full rounded-md border border-s-300 p-3'
               />
            </div>
         </div>
         {/* Assistance Section */}
         <div className='mt-6 hidden w-full rounded-xl bg-white p-6 sm:block'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-800'>
               {TRANSLATED_VALUES[locale]?.cart.needAssistance}
            </h2>
            <p className='mb-4 font-bold text-gray-600'>
               {TRANSLATED_VALUES[locale]?.cart.callOrWrite}:
            </p>
            <div className='space-y-2'>
               <p className='text-gray-700'>
                  <span className='font-medium'>
                     {TRANSLATED_VALUES[locale]?.cart.phone}:
                  </span>{' '}
                  <a
                     href='tel:+1-888-689-0688'
                     className='font-bold text-blue-600 hover:text-blue-800'
                  >
                     +1 978 733 0253
                  </a>
               </p>
               <p className='text-gray-700'>
                  <span className='font-medium'>
                     {TRANSLATED_VALUES[locale]?.cart.email}:
                  </span>{' '}
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
