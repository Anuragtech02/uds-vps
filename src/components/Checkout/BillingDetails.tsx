'use client';

import { useState, useEffect } from 'react';
import Button from '../commons/Button';
import CustomPhoneInput from '../CustomPhoneInput';

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
 const [phone, setPhone] = useState('');
 const [formData, setFormData] = useState<BillingFormData>({
   firstName: '',
   lastName: '',
   email: '',
   country: '',
   state: '',
   city: '',
   address: '',
   orderNotes: ''
 });

 const [countries, setCountries] = useState<Country[]>([]);
 const [states, setStates] = useState<State[]>([]);
 const [loadingCountries, setLoadingCountries] = useState(false);
 const [loadingStates, setLoadingStates] = useState(false);
 const [errors, setErrors] = useState<Partial<BillingFormData>>({});
 const [touched, setTouched] = useState<Partial<Record<keyof BillingFormData, boolean>>>({});

 useEffect(() => {
   const fetchCountries = async () => {
     setLoadingCountries(true);
     try {
       // Using a reliable country-state API
       const response = await fetch('https://countriesnow.space/api/v0.1/countries/states');
       const data = await response.json();
       const formattedCountries = data.data.map((country: any) => ({
         name: country.name,
         code: country.iso3,
         states: country.states.map((state: any) => ({
           name: state.name,
           code: state.state_code || state.name
         }))
       }));
       setCountries(formattedCountries);
     } catch (error) {
       console.error('Error fetching countries:', error);
       setErrors(prev => ({
         ...prev,
         country: 'Failed to load countries'
       }));
     } finally {
       setLoadingCountries(false);
     }
   };

   fetchCountries();
 }, []);

 const handleCountryChange = (value: string) => {
   handleChange('country', value);
   // Reset state when country changes
   handleChange('state', '');
   
   if (!value) {
     setStates([]);
     return;
   }

   const selectedCountry = countries.find(c => c.code === value);
   if (selectedCountry) {
     setStates(selectedCountry.states);
   }
 };  // Update states when country chang

 const validateField = (name: keyof BillingFormData, value: string) => {
   const error: string | undefined = (() => {
     switch (name) {
       case 'firstName':
       case 'lastName':
         if (!value.trim()) return 'This field is required';
         if (value.length < 2) return 'Must be at least 2 characters';
         if (!/^[a-zA-Z\s]*$/.test(value)) return 'Only letters are allowed';
         break;
       

       
       case 'email':
         if (!value) return 'Email is required';
         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
         break;
       
       case 'address':
         if (!value.trim()) return 'Address is required';
         if (value.length < 10) return 'Address must be at least 10 characters long';
         break;

       case 'state':
       case 'city':
         if (!value.trim()) return 'This field is required';
         break;
     }
     return undefined;
   })();

   setErrors(prev => ({
     ...prev,
     [name]: error
   }));
   
   return !error;
 };

 const handleBlur = (name: keyof BillingFormData) => {
   setTouched(prev => ({
     ...prev,
     [name]: true
   }));
   // @ts-ignore
   validateField(name, formData[name]);
 };

 const handleChange = (name: keyof BillingFormData, value: string) => {
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));

   if (touched[name]) {
     validateField(name, value);
   }
 };

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   
   // Validate all fields
   const validations = Object.keys(formData).map(key => {
      // @ts-ignore
     return validateField(key as keyof BillingFormData, formData[key as keyof BillingFormData]);
   });

   setTouched(
     Object.keys(formData).reduce((acc, key) => ({
       ...acc,
       [key]: true
     }), {})
   );

   if (validations.every(Boolean)) {
     console.log('Form submitted:', {
       ...formData,
       mobileNumber: phone
     });
     // Add your submission logic here
   }
 };

 const inputClassName = (fieldName: keyof BillingFormData) => `
   w-full rounded-md border p-3
   ${errors[fieldName] && touched[fieldName] 
     ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
     : 'border-s-300 focus:border-blue-500 focus:ring-blue-500'}
 `;

 return (
   <div>
     <form onSubmit={handleSubmit} className="space-y-6 text-sm md:space-y-8">
       <p className="text-2xl font-bold text-s-600">Billing Details</p>
       
       <div className="flex flex-col gap-4 md:flex-row lg:items-start">
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="first-name">First Name*</label>
           <input
             type="text"
             id="first-name"
             value={formData.firstName}
             onChange={(e) => handleChange('firstName', e.target.value)}
             onBlur={() => handleBlur('firstName')}
             placeholder="Enter your first name"
             className={inputClassName('firstName')}
           />
           {errors.firstName && touched.firstName && (
             <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
           )}
         </div>
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="last-name">Last Name*</label>
           <input
             type="text"
             id="last-name"
             value={formData.lastName}
             onChange={(e) => handleChange('lastName', e.target.value)}
             onBlur={() => handleBlur('lastName')}
             placeholder="Enter your last name"
             className={inputClassName('lastName')}
           />
           {errors.lastName && touched.lastName && (
             <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
           )}
         </div>
       </div>

       <div className="flex flex-col gap-4 md:flex-row lg:items-start">
         <div className="shrink grow basis-0">
           <CustomPhoneInput
             value={phone}
             onChange={(value: string) => setPhone(value)}
             required
           />
         </div>
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="email">Email*</label>
           <input
             type="email"
             id="email"
             value={formData.email}
             onChange={(e) => handleChange('email', e.target.value)}
             onBlur={() => handleBlur('email')}
             placeholder="Enter your email"
             className={inputClassName('email')}
           />
           {errors.email && touched.email && (
             <p className="mt-1 text-sm text-red-500">{errors.email}</p>
           )}
         </div>
       </div>

       <div className="flex flex-col gap-4 md:flex-row lg:items-start">
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="country">Country/Region*</label>
           <select
             id="country"
             value={formData.country}
             onChange={(e) => handleCountryChange(e.target.value)}
             onBlur={() => handleBlur('country')}
             className={inputClassName('country')}
             disabled={loadingCountries}
           >
             <option value="">
               {loadingCountries ? 'Loading countries...' : 'Select your country'}
             </option>
             {countries.map((country) => (
               <option key={country.code} value={country.code}>
                 {country.name}
               </option>
             ))}
           </select>
           {errors.country && touched.country && (
             <p className="mt-1 text-sm text-red-500">{errors.country}</p>
           )}
         </div>
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="state">State*</label>
           <select
             id="state"
             value={formData.state}
             onChange={(e) => handleChange('state', e.target.value)}
             onBlur={() => handleBlur('state')}
             className={inputClassName('state')}
             disabled={!formData.country || loadingStates}
           >
             <option value="">
               {!formData.country 
                 ? 'Select a country first'
                 : loadingStates 
                   ? 'Loading states...' 
                   : 'Select your state'
               }
             </option>
             {states.map((state) => (
               <option key={state.code} value={state.code}>
                 {state.name}
               </option>
             ))}
           </select>
           {errors.state && touched.state && (
             <p className="mt-1 text-sm text-red-500">{errors.state}</p>
           )}
         </div>
       </div>

       <div className="flex flex-col gap-4 md:flex-row lg:items-start">
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="city">Town/City*</label>
           <input
             type="text"
             id="city"
             value={formData.city}
             onChange={(e) => handleChange('city', e.target.value)}
             onBlur={() => handleBlur('city')}
             placeholder="Enter your city"
             className={inputClassName('city')}
           />
           {errors.city && touched.city && (
             <p className="mt-1 text-sm text-red-500">{errors.city}</p>
           )}
         </div>
         <div className="shrink grow basis-0 space-y-1">
           <label htmlFor="address">Street Address*</label>
           <input
             type="text"
             id="address"
             value={formData.address}
             onChange={(e) => handleChange('address', e.target.value)}
             onBlur={() => handleBlur('address')}
             placeholder="Enter your street address"
             className={inputClassName('address')}
           />
           {errors.address && touched.address && (
             <p className="mt-1 text-sm text-red-500">{errors.address}</p>
           )}
         </div>
       </div>

       <div className="space-y-1">
         <label htmlFor="orderNotes">Order notes (optional)</label>
         <textarea
           id="orderNotes"
           value={formData.orderNotes}
           onChange={(e) => handleChange('orderNotes', e.target.value)}
           placeholder="Notes about your order, e.g. special notes for delivery."
           className="min-h-32 w-full rounded-md border border-s-300 p-3"
         />
       </div>

       <div className="flex justify-end">
         <button
           type="submit"
           className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
         >
           Submit
         </button>
       </div>
     </form>
   </div>
 );
};

export default BillingDetails;