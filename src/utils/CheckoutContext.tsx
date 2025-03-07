'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface BillingFormData {
   firstName: string;
   lastName: string;
   email: string;
   country: string;
   state: string;
   city: string;
   address: string;
   orderNotes?: string;
   phone: string; // Keep phone as part of form data only
}

interface CheckoutContextType {
   formData: BillingFormData;
   setFormData: (
      data: BillingFormData | ((prev: BillingFormData) => BillingFormData),
   ) => void;
   errors: Partial<BillingFormData>;
   setErrors: (
      errors:
         | Partial<BillingFormData>
         | ((prev: Partial<BillingFormData>) => Partial<BillingFormData>),
   ) => void;
   touched: Partial<Record<keyof BillingFormData, boolean>>;
   setTouched: (
      touched:
         | Partial<Record<keyof BillingFormData, boolean>>
         | ((
              prev: Partial<Record<keyof BillingFormData, boolean>>,
           ) => Partial<Record<keyof BillingFormData, boolean>>),
   ) => void;
   selectedCurrency: string;
   setSelectedCurrency: (currency: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
   undefined,
);

export function CheckoutProvider({ children }: { children: ReactNode }) {
   const [formData, setFormData] = useState<BillingFormData>({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      state: '',
      city: '',
      address: '',
      orderNotes: '',
      phone: '',
   });
   const [selectedCurrency, setSelectedCurrency] = useState('USD');

   const [errors, setErrors] = useState<Partial<BillingFormData>>({});
   const [touched, setTouched] = useState<
      Partial<Record<keyof BillingFormData, boolean>>
   >({});
   // Add debugging
   const updateFormData = (
      update: BillingFormData | ((prev: BillingFormData) => BillingFormData),
   ) => {
      setFormData((prev) => {
         const newData = typeof update === 'function' ? update(prev) : update;
         // console.log('Form Data Updated:', newData);
         return newData;
      });
   };

   return (
      <CheckoutContext.Provider
         value={{
            formData,
            setFormData: updateFormData,
            errors,
            setErrors,
            touched,
            setTouched,
            selectedCurrency,
            setSelectedCurrency,
         }}
      >
         {children}
      </CheckoutContext.Provider>
   );
}

export function useCheckout() {
   const context = useContext(CheckoutContext);
   if (context === undefined) {
      throw new Error('useCheckout must be used within a CheckoutProvider');
   }
   return context;
}
