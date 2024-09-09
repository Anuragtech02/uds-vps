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
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[2rem] font-semibold text-s-500'>
                     My account
                  </p>
                  <LoginForm />
               </div>

               <div className='flex-[0.4] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
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
