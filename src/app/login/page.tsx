import LoginForm from '@/components/Login/LoginForm';
import LoginSidebar from '@/components/Login/LoginSidebar';
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
                  <div className='flex w-full items-stretch rounded-l-md'>
                     <input
                        type='text'
                        placeholder='Aerospace'
                        className='grow rounded-l-md border border-gray-300 bg-gray-50 px-6 py-2'
                     />
                     <div className='grid aspect-square w-10 cursor-pointer place-items-center bg-blue-3 text-2xl'>
                        <IoSearch color='white' />
                     </div>
                  </div>
                  <LoginSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
