import LoginForm from '@/components/Login/LoginForm';
import LoginSidebar from '@/components/Login/LoginSidebar';
import { IoIosSearch } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

const Login = () => {
   return (
      <div className='container pt-40'>
         <div className='mt-10 rounded-xl bg-white p-6'>
            <div className='flex flex-col-reverse items-start gap-6 md:flex-row md:gap-10'>
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[2rem] font-semibold text-s-500'>
                     My account
                  </p>
                  <LoginForm />
               </div>

               <div className='flex-[0.4] space-y-4 md:space-y-6'>
                  <div className='flex items-center gap-3 rounded-full border border-blue-2 px-6 py-3'>
                     <span className='text-2xl'>
                        <IoIosSearch />
                     </span>
                     <input
                        type='text'
                        placeholder='Search for reports, industries and more...'
                        className='w-full bg-transparent text-[1.125rem] outline-none'
                     />
                  </div>
                  <LoginSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
