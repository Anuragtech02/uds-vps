'use client';
import Button from '@/components/commons/Button';
import Link from 'next/link';
import { useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const SignUp = () => {
   const [showPassword, setShowPassword] = useState(false);

   return (
      <div className='container pt-40'>
         <div className='mx-auto mt-10 rounded-xl bg-white p-6 md:p-12 xl:w-2/3'>
            <h2 className='text-center font-semibold text-blue-3'>Sign Up</h2>
            <div className='mt-10'>
               <form className='space-y-4'>
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
                     <label
                        htmlFor='password'
                        className='text-sm font-semibold'
                     >
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
                     <div className='flex items-center gap-2 py-4'>
                        <input type='checkbox' id='remember' />
                        <label htmlFor='remember'>Remember me</label>
                     </div>

                     <Button
                        className='mt-6 w-full py-4 font-semibold'
                        variant='secondary'
                     >
                        Sign Up
                     </Button>
                     <p className='mx-auto mt-6 text-center md:w-2/3'>
                        By continuing, you agree to our{' '}
                        <Link href='' className='text-[#007AFF]'>
                           Terms and Privacy Policy.
                        </Link>
                     </p>
                  </div>
               </form>
            </div>
         </div>
         <div className='mt-10 text-center'>
            <p>
               Already have an account?{' '}
               <Link href='/login' className='text-[#007AFF]'>
                  Login
               </Link>
            </p>
         </div>
      </div>
   );
};

export default SignUp;
