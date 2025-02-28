'use client';
// export const runtime = 'edge';
import CartPage from '@/components/Cart/CartPage';
import { CheckoutProvider } from '@/utils/CheckoutContext';

export default function CheckoutPage() {
   return (
      <CheckoutProvider>
         <CartPage />
      </CheckoutProvider>
   );
}
