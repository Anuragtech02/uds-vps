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
  phone: string;
}

interface CheckoutContextType {
  formData: BillingFormData;
  setFormData: (data: BillingFormData) => void;
  phone: string;
  setPhone: (phone: string) => void;
  errors: Partial<BillingFormData>;
  setErrors: (errors: Partial<BillingFormData>) => void;
  touched: Partial<Record<keyof BillingFormData, boolean>>;
  setTouched: (touched: Partial<Record<keyof BillingFormData, boolean>>) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

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
    phone: ''
  });
  
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Partial<BillingFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BillingFormData, boolean>>>({});

  return (
    <CheckoutContext.Provider 
      value={{
        formData,
        setFormData,
        phone,
        setPhone,
        errors,
        setErrors,
        touched,
        setTouched
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