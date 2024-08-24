import Button from '../commons/Button';

const BillingDetails = () => {
   return (
      <div>
         <form action='' className='space-y-6 text-sm md:space-y-8'>
            <p className='text-2xl font-bold text-s-600'>Billing Details</p>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='last-name'>First Name*</label>
                  <input
                     type='text'
                     id='first-name'
                     required
                     placeholder='Enter your first name'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='last-name'>Full Name*</label>
                  <input
                     type='text'
                     id='last-name'
                     required
                     placeholder='Enter your last name'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
            </div>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='mobile-number'>Mobile Number*</label>
                  <input
                     type='text'
                     required
                     placeholder='Enter your mobile number'
                     id='mobile-number'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='email'>Email*</label>
                  <input
                     type='email'
                     id='email'
                     required
                     placeholder='Enter your email'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
            </div>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='country'>Country/Region</label>
                  <select
                     id='country'
                     className='w-full rounded-md border border-s-300 p-3'
                  >
                     <option className='opacity-50' value=''>
                        Select your country
                     </option>
                     <option value='India'>India</option>
                     <option value='USA'>USA</option>
                     <option value='UK'>UK</option>
                  </select>
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='pincode'>Pincode*</label>
                  <input
                     type='text'
                     id='pincode'
                     required
                     placeholder='Enter your pincode'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
            </div>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='state'>State</label>
                  <select
                     id='state'
                     className='w-full rounded-md border border-s-300 p-3'
                  >
                     <option className='opacity-50' value=''>
                        Select your State
                     </option>
                     <option value='Karnataka'>Karnataka</option>
                     <option value='Kerala'>Kerala</option>
                     <option value='Tamil Nadu'>Tamil Nadu</option>
                  </select>
               </div>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='city'>Town-city</label>
                  <select
                     id='city'
                     className='w-full rounded-md border border-s-300 p-3'
                  >
                     <option className='opacity-50' value=''>
                        Select your Town-city
                     </option>
                     <option value='Bangalore'>Bangalore</option>
                     <option value='Mangalore'>Mangalore</option>
                     <option value='Mysore'>Mysore</option>
                  </select>
               </div>
            </div>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='address'>Street Address*</label>
                  <input
                     type='text'
                     id='address'
                     required
                     placeholder='Enter your street address'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
               <div className='hidden shrink grow basis-0 space-y-1 md:block'></div>
            </div>

            <div className='space-y-1'>
               <label htmlFor='message'>Order notes (optional)</label>
               <textarea
                  name='message'
                  id='message'
                  placeholder='Notes about your order, e.g. special notes for delivery.'
                  className='min-h-32 w-full rounded-md border border-s-300 p-3'
               ></textarea>
            </div>
         </form>
      </div>
   );
};

export default BillingDetails;
