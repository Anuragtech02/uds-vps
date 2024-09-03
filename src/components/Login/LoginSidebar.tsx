import { BiCopy } from 'react-icons/bi';
import { MdFileCopy } from 'react-icons/md';
import Button from '../commons/Button';

const recentPostsSample = [
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
];

const LoginSidebar = () => {
   return (
      <div className='space-y-4 md:space-y-6'>
         <p className='text-lg font-semibold text-s-700'>Recent Post</p>
         <div className='flex flex-col gap-4 font-semibold'>
            {recentPostsSample.map((post, index) => (
               <div key={index} className='flex gap-2'>
                  <div className='mt-1 text-2xl'>
                     <MdFileCopy className='fill-s-700' />
                  </div>
                  <p className='text-s-700'>{post}</p>
               </div>
            ))}
         </div>

         <div className='rounded-xl border border-s-500 p-4 md:p-6'>
            <p className='mb-4 text-lg font-semibold text-s-500'>
               Get a call back
            </p>
            <form className='space-y-4'>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='name' className='text-sm font-semibold'>
                     Name*
                  </label>
                  <input
                     type='text'
                     id='name'
                     placeholder='Enter your name'
                     className='rounded-md border border-s-300 p-2'
                  />
               </div>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='phone' className='text-sm font-semibold'>
                     Mobile Number*
                  </label>
                  <input
                     type='tel'
                     id='phone'
                     placeholder='Enter your phone number'
                     className='rounded-md border border-s-300 p-2'
                  />
               </div>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='email' className='text-sm font-semibold'>
                     Email*
                  </label>
                  <input
                     type='email'
                     id='email'
                     placeholder='Enter your email'
                     className='rounded-md border border-s-300 p-2'
                  />
               </div>
               <div className='flex flex-col gap-1'>
                  <label htmlFor='message' className='text-sm font-semibold'>
                     Message*
                  </label>
                  <textarea
                     id='message'
                     placeholder='Enter your message'
                     className='rounded-md border border-s-300 p-2'
                  />
               </div>
               <Button className='mt-4' variant='secondary'>
                  Send Message
               </Button>
            </form>
         </div>
      </div>
   );
};

export default LoginSidebar;
