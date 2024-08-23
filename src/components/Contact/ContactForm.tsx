import Button from '../commons/Button';

const ContactForm = () => {
   return (
      <div className='rounded-xl bg-white p-4 font-medium text-[#020D19] md:p-6'>
         <form action='' className='space-y-6 text-sm md:space-y-8'>
            <p className='text-[1.625rem] text-blue-1'>Get in Touch</p>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='name'>Full Name*</label>
                  <input
                     type='text'
                     id='name'
                     required
                     placeholder='Enter your full name'
                     className='w-full rounded-md border border-s-300 p-3'
                  />
               </div>
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
            </div>
            <div className='flex flex-col items-center gap-4 md:flex-row'>
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
               <div className='shrink grow basis-0 space-y-1'>
                  <label htmlFor='country'>Country</label>
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
            </div>
            <div className='space-y-1'>
               <label htmlFor='name'>Subject</label>
               <textarea
                  name='message'
                  id='message'
                  placeholder='Enter Subject'
                  className='min-h-32 w-full rounded-md border border-s-300 p-3'
               ></textarea>
            </div>
            <div>
               <Button variant='secondary'>Send Message</Button>
            </div>
         </form>
      </div>
   );
};

export default ContactForm;
