'use client';
export const runtime = 'edge';

import Button from '@/components/commons/Button';
import { LocalizedLink } from '@/components/commons/LocalizedLink';
import { signup } from '@/utils/api/csr-services';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const SignUp = () => {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [err, setErr] = useState<null | string>(null);
   const [successMessage, setSuccessMessage] = useState<null | string>(null);
   const [loading, setLoading] = useState(false);
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         setErr('* Passwords do not match');
         return;
      }
      if (!email || !password || !confirmPassword) {
         setErr('* Please fill all the fields');
         return;
      }
      setErr(null);
      setSuccessMessage(null);
      setLoading(true);
      // Add your signup logic here
      try {
         const res = await signup({
            email: email,
            username: email,
            password: password,
         });
         setSuccessMessage('* Signup Successfull! Please Login');
         router.push('/login');
      } catch (err) {
         // @ts-ignore
         console.log(err?.response?.data?.error?.message);
         // @ts-ignore
         setErr('* ' + err?.response?.data?.error?.message);
      }
      setLoading(false);
   };

   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.currentTarget.value);
   };
   const handleConfirmPasswordChange = (
      e: React.ChangeEvent<HTMLInputElement>,
   ) => {
      setConfirmPassword(e.currentTarget.value);
   };
   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.currentTarget.value);
   };
   return (
      <div className='container pt-40'>
         <div className='mx-auto mt-10 rounded-xl bg-white p-6 md:p-12 xl:w-2/3'>
            <h2 className='text-center font-semibold text-blue-3'>Sign Up</h2>
            <div className='mt-10'>
               <form className='space-y-4' onSubmit={handleSubmit}>
                  <div className='flex flex-col gap-1'>
                     <label htmlFor='email' className='text-sm font-semibold'>
                        Username or Email*
                     </label>
                     <input
                        type='email'
                        id='email'
                        placeholder='Enter your username or email'
                        className='rounded-md border border-s-300 p-2'
                        value={email}
                        onChange={handleEmailChange}
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
                           value={password}
                           onChange={handlePasswordChange}
                        />
                        <div
                           className='absolute right-3 top-1/2 -translate-y-1/2'
                           onClick={() => setShowPassword(!showPassword)}
                        >
                           {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                        </div>
                     </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                     <label
                        htmlFor='confirmPassword'
                        className='text-sm font-semibold'
                     >
                        Confirm Password*
                     </label>
                     <div className='relative w-full'>
                        <input
                           type={showConfirmPassword ? 'text' : 'password'}
                           id='confirmPassword'
                           placeholder='Confirm your password'
                           className='w-full rounded-md border border-s-300 p-2'
                           value={confirmPassword}
                           onChange={handleConfirmPasswordChange}
                        />
                        <div
                           className='absolute right-3 top-1/2 -translate-y-1/2'
                           onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                           }
                        >
                           {showConfirmPassword ? (
                              <BsEyeFill />
                           ) : (
                              <BsEyeSlashFill />
                           )}
                        </div>
                     </div>
                     {err && (
                        <p className='1s mt-2 animate-bounce text-sm font-semibold text-red-500'>
                           {err}
                        </p>
                     )}
                     {successMessage && (
                        <p className='1s animate-bounce text-sm font-semibold text-green-500'>
                           {successMessage}
                        </p>
                     )}
                     <Button
                        className='mt-6 w-full py-4 font-semibold'
                        variant='secondary'
                        disabled={loading}
                     >
                        {loading ? (
                           <div className='flex items-center justify-center space-x-2'>
                              <BiLoader
                                 size={20}
                                 color='#ffffff'
                                 className='animate-spin'
                              />
                              <p className='text-white'>Loading...</p>
                           </div>
                        ) : (
                           'Sign Up'
                        )}
                     </Button>
                     <p className='mx-auto mt-6 text-center md:w-2/3'>
                        By continuing, you agree to our{' '}
                        <LocalizedLink href='' className='text-[#007AFF]'>
                           Terms and Privacy Policy.
                        </LocalizedLink>
                     </p>
                  </div>
               </form>
            </div>
         </div>
         <div className='mt-10 text-center'>
            <p>
               Already have an account?{' '}
               <LocalizedLink href='/login' className='text-[#007AFF]'>
                  Login
               </LocalizedLink>
            </p>
         </div>
      </div>
   );
};

export default SignUp;
