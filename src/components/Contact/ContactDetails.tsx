import {
   BsFacebook,
   BsInstagram,
   BsLinkedin,
   BsTwitterX,
   BsYoutube,
} from 'react-icons/bs';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';

const ContactDetails = () => {
   return (
      <div className='rounded-xl bg-white p-4 font-medium text-blue-2 md:p-6'>
         <div className='space-y-6 md:space-y-8'>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>Contact Info</p>
               <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                     <FaPhone />
                     <p>1234567890</p>
                  </div>
                  <div className='flex items-center gap-2'>
                     <FaPhone />
                     <p>1234567890</p>
                  </div>
               </div>
               <div className='mt-1 flex items-center gap-2'>
                  <FaEnvelope />
                  <p>sales@univdatos.com</p>
               </div>
            </div>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>Visit Us</p>
               <p>
                  4th & 5th Floor, C80B, Sector 8, Noida, Uttar Pradesh- 201301,
                  India
               </p>
            </div>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>Follow Us</p>
               <div className='flex items-center gap-4'>
                  <a href='#'>
                     <BsFacebook />
                  </a>
                  <a href='#'>
                     <BsYoutube />
                  </a>
                  <a href='#'>
                     <BsTwitterX />
                  </a>
                  <a href='#'>
                     <BsInstagram />
                  </a>
                  <a href='#'>
                     <BsLinkedin />
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ContactDetails;
