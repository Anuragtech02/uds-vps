'use client';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Button from '../commons/Button';
import { useState } from 'react';
import { login } from '@/utils/api/csr-services';
import { BiLoader } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState(null);

   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
         setError('* Please fill all the fields');
         return;
      }
      setLoading(true);
      try {
         const res = await login({ identifier: email, password });
         setError(null);
         Cookies.set('authorization', `Bearer ${res.jwt}`, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
         });
         router.push('/');
      } catch (error) {
         console.log(error);
         setError('* ' + error?.response?.data?.error?.message);
      }
      setLoading(false);
   };

   return (
      <div className='rounded-xl border border-s-300 p-4 md:p-6 max-w-[500px]'>
         <p className='text-[1.75rem] font-semibold text-s-800'>Login</p>
         <form className='mt-4 space-y-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
               <label htmlFor='email' className='text-sm font-semibold'>
                  Username or Email*
               </label>
               <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
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

            {error && (
               <p className='mt-2 animate-bounce text-start text-sm text-red-600'>
                  {error}
               </p>
            )}
            <Button
               variant='secondary'
               type='submit'
               disabled={loading}
               className={loading ? 'cursor-not-allowed opacity-50' : ''}
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
                  'Login'
               )}
            </Button>
         </form>
      </div>
   );
};

export default LoginForm;
