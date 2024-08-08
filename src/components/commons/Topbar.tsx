import { FaPhoneAlt } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { IoIosSearch, IoMdCart } from 'react-icons/io';
import { IoMail } from 'react-icons/io5';

const Topbar = () => {
   return (
      <div className='container pb-4'>
         <div className='flex items-center justify-between text-[#1D2C60]'>
            <div className='flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-4 md:text-base'>
               <p className='flex items-center gap-2'>
                  <FaPhoneAlt />
                  <span>+1 9782263411</span>
               </p>
               <p className='flex items-center gap-2'>
                  <IoMail />
                  <span>
                     <a href='mailto:contact@univdatos.com'>
                        contact@univdatos.com
                     </a>
                  </span>
               </p>
            </div>
            <div className='flex items-center gap-4'>
               <select name='' id='' className='hidden md:block'>
                  <option value=''>Energy Market</option>
               </select>

               <span className='cursor-pointer text-xl'>
                  <IoIosSearch />
               </span>
               <span className='cursor-pointer text-xl'>
                  <FaCircleUser />
               </span>
               <span className='cursor-pointer text-xl'>
                  <IoMdCart />
               </span>
            </div>
         </div>
      </div>
   );
};

export default Topbar;
