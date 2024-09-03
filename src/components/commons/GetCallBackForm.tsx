import Button from './Button';

const GetCallBackForm = () => {
   return (
      <div className='rounded-xl border border-s-300 p-4 md:p-6'>
         <p className='mb-4 font-semibold text-s-700 md:text-lg'>
            Get a call back
         </p>
         <form className='space-y-4 md:space-y-6'>
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
            <div>
               <Button className='mt-4 w-full' variant='secondary'>
                  Send Message
               </Button>
            </div>
         </form>
      </div>
   );
};

export default GetCallBackForm;
