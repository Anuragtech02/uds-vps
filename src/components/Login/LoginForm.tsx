'use client';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Button from '../commons/Button';
import { useState } from 'react';

const LoginForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   return (
      <div className='rounded-xl border border-s-500 p-4 md:p-6'>
         <p className='text-[1.75rem] font-semibold text-s-800'>Login</p>
         <form className='mt-4 space-y-4'>
            <div className='flex flex-col gap-1'>
               <label htmlFor='email' className='text-sm font-semibold'>
                  Username or Email*
               </label>
               <input
                  type='email'
                  id='email'
                  placeholder='Enter your username or email'
                  className='rounded-md border border-s-300 p-2'
               />
            </div>
            <div className='flex flex-col gap-1'>
               <label htmlFor='password' className='text-sm font-semibold'>
                  Password*
               </label>
               <div className='relative w-full'>
                  <input
                     type={showPassword ? 'text' : 'password'}
                     id='password'
                     placeholder='Enter your password'
                     className='w-full rounded-md border border-s-300 p-2'
                  />
                  <div
                     className='absolute right-3 top-1/2 -translate-y-1/2'
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                  </div>
               </div>
            </div>

            <div className='flex items-center gap-2 py-4'>
               <input type='checkbox' id='remember' />
               <label htmlFor='remember'>Remember me</label>
            </div>

            <Button variant='secondary'>Login</Button>
         </form>
      </div>
   );
};

export default LoginForm;
