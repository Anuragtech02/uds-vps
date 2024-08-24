import Link from 'next/link';
import Button from '../commons/Button';
import CheckoutOrderItem from './CheckoutOrderItem';
import CostCalculations from './CostCalculations';
import PaymentGateways from './PaymentGateways';

const sampleOrderItems = [
   {
      id: 1,
      name: 'Product 1',
      price: 100,
      quantity: 1,
   },
   {
      id: 2,
      name: 'Product 2',
      price: 200,
      quantity: 2,
   },
   {
      id: 3,
      name: 'Product 3',
      price: 300,
      quantity: 3,
   },
];

const Order = () => {
   const totalCost = sampleOrderItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
   }, 0);
   return (
      <div className='space-y-4 md:space-y-6'>
         <p className='text-2xl font-bold text-s-600'>Your order</p>
         <div className='rounded-xl border border-s-400 p-3'>
            {sampleOrderItems.map((item) => (
               <CheckoutOrderItem key={item.id} {...item} />
            ))}
         </div>
         <div className='rounded-xl border border-s-400 p-3'>
            <CostCalculations cost={totalCost} city='Mumbai' />
         </div>

         <div>
            <PaymentGateways />
         </div>
         <div className='flex items-start gap-2'>
            <input type='checkbox' name='tnc' id='tnc' className='mt-2' />
            <label htmlFor='tnc' className='text-gray-500'>
               Your personal data will be used to process your order, support
               your experience throughout this website, and for other purposes
               described in our{' '}
               <Link className='underline' href='/privacy-policy'>
                  privacy policy
               </Link>
               . <br />I have read and agree to the website{' '}
               <Link className='underline' href='/terms-and-conditions'>
                  terms and conditions
               </Link>
               *
            </label>
         </div>
         <Button variant='secondary' className='w-full'>
            Proceed to checkout
         </Button>
      </div>
   );
};

export default Order;
