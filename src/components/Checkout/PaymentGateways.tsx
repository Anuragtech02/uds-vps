'use client';
import { useState } from 'react';

const PaymentGateways = () => {
   const [paymentMethod, setPaymentMethod] = useState('');

   const handleSelect = (e: any) => {
      setPaymentMethod(e.target.id);
   };

   return (
      <div className='space-y-4 text-s-600 md:space-y-6'>
         <p className='text-lg font-bold md:text-2xl'>Payment Method</p>
         <div className='space-y-2 font-bold md:text-xl'>
            <div className='flex items-center gap-4'>
               <input
                  onChange={handleSelect}
                  checked={paymentMethod === 'paypal'}
                  type='radio'
                  name='payment'
                  id='paypal'
               />
               <label htmlFor='paypal'>Paypal</label>
            </div>
            <div className='flex items-center gap-4'>
               <input
                  onChange={handleSelect}
                  checked={paymentMethod === 'ccavenue'}
                  type='radio'
                  name='payment'
                  id='ccavenue'
               />
               <label htmlFor='ccavenue'>CCAvenue</label>
            </div>
         </div>
      </div>
   );
};

export default PaymentGateways;
