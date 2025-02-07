// export const runtime = 'edge';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import LoginForm from '@/components/Login/LoginForm';
import LoginSidebar from '@/components/Login/LoginSidebar';
import { IoIosSearch } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

const Login = () => {
   return (
      <div className='container pt-40'>
         <div className='mt-10 rounded-xl bg-white p-6'>
            <div className='flex flex-col items-start gap-6 md:flex-row md:gap-10'>
               <div className='w-full space-y-4 md:space-y-6 lg:flex-[0.6]'>
                  <p className='text-[1.625rem] font-semibold text-s-500 md:text-[2rem]'>
                     My account
                  </p>
                  <LoginForm />
               </div>

               <div className='w-full space-y-4 md:space-y-6 lg:flex-[0.4]'>
                  <div className='hidden w-full lg:block [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <LoginSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
