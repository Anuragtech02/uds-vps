import { BiCopy } from 'react-icons/bi';
import { MdFileCopy } from 'react-icons/md';
import Button from '../commons/Button';
import GetCallBackForm from '../commons/GetCallBackForm';

const recentPostsSample = [
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
   'Global Nitrogen Oxide Control System Market Seen Soaring 5.8% Growth to Reach USD 7,556.57 Million by 2030, Projects UnivDatos Market Insights',
];

const LoginSidebar = () => {
   return (
      <div className='space-y-4 md:space-y-6'>
         <p className='text-lg font-semibold text-s-700'>Recent Post</p>
         <div className='flex flex-col gap-4 font-semibold'>
            {recentPostsSample.map((post, index) => (
               <div key={index} className='flex gap-2'>
                  <div className='mt-1 text-2xl'>
                     <MdFileCopy className='fill-s-700' />
                  </div>
                  <p className='text-s-700'>{post}</p>
               </div>
            ))}
         </div>

         <GetCallBackForm />
      </div>
   );
};

export default LoginSidebar;
