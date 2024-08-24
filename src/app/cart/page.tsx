import CartItem from '@/components/Cart/CartItem';
import CostCalculations from '@/components/Cart/CostCalculations';
import Button from '@/components/commons/Button';
import Link from 'next/link';

const sampleCartItems = [
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

const Cart = () => {
   const totalCost = sampleCartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
   }, 0);

   return (
      <div className='container pt-40'>
         <div className='mt-5 w-full space-y-4 rounded-xl bg-white p-6 md:space-y-6'>
            <div className='flex items-center justify-between'>
               <p className='text-[2rem] font-semibold text-s-800'>Cart</p>
               <div className='flex items-stretch gap-4'>
                  <input
                     type='text'
                     className='bg-gray-50 px-6 text-sm'
                     placeholder='Coupon Code'
                  />

                  <Button variant='secondary'>Apply Code</Button>

                  <select
                     name=''
                     id=''
                     className='rounded-full bg-s-200 px-4 text-lg font-bold'
                  >
                     <option value=''>USD $</option>
                     <option value=''>INR ₹</option>
                     <option value=''>EUR €</option>
                     <option value=''>GBP £</option>
                  </select>
               </div>
            </div>
            <div className='rounded-xl border border-s-400 p-3'>
               <div className='flex items-center justify-between text-lg font-bold text-s-600 md:text-2xl'>
                  <div className='w-1/2'>
                     <p>Product</p>
                  </div>
                  <div className='flex w-1/2 items-center gap-3 md:gap-6'>
                     <div className='w-1/3'>
                        <p>Price</p>
                     </div>
                     <div className='w-1/3'>
                        <p>Quantity</p>
                     </div>
                     <div className='w-1/3'>
                        <p>Subtotal</p>
                     </div>
                  </div>
               </div>
               {sampleCartItems.map((item) => (
                  <CartItem key={item.id} {...item} />
               ))}
            </div>
            <div className='rounded-xl border border-s-400 p-3'>
               <CostCalculations cost={totalCost} city='Mumbai' />
            </div>
            <div className='w-full text-right'>
               <Link href='/checkout'>
                  <Button variant='secondary'>Proceed to Checkout</Button>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Cart;
