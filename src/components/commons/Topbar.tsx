import { useSearchStore } from '@/stores/search.store';
import Link from 'next/link';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { IoIosSearch, IoMdCart } from 'react-icons/io';
import { IoMail } from 'react-icons/io5';
interface ITopbarProps {
   header: {
      phoneNumber: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      logo?: { data: { attributes: { url?: string } } };
      ctaButton: { id: number; title: string; link: string };
   };
   industries: any[];
}
const Topbar = ({ header, industries }: ITopbarProps) => {
   const searchStore = useSearchStore();
   return (
      <div className='container pb-4'>
         <div className='flex items-center justify-between text-[#1D2C60]'>
            <div className='flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-4 md:text-base'>
               <p className='flex items-center gap-2'>
                  <FaPhoneAlt />
                  <span>{header?.phoneNumber}</span>
               </p>
               <p className='flex items-center gap-2'>
                  <IoMail />
                  <span>
                     <a href={`mailto:${header?.email ?? ''}`}>
                        {header?.email}
                     </a>
                  </span>
               </p>
            </div>
            <div className='flex items-center gap-4'>
               {/* <select title='Industry' id='' className='hidden md:block'>
                  {industries?.map((industry) => (
                     <option key={industry?.slug} value={industry?.slug}>
                        {industry?.name}
                     </option>
                  ))}
               </select> */}

               <span
                  className='cursor-pointer text-xl'
                  onClick={() => {
                     searchStore?.toggleGlobalSearch();
                  }}
               >
                  <IoIosSearch />
               </span>
               <Link href='/login'>
                  <span className='text-xl'>
                     <FaCircleUser />
                  </span>
               </Link>
               <Link href='/cart'>
                  <span className='cursor-pointer text-xl'>
                     <IoMdCart />
                  </span>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Topbar;
