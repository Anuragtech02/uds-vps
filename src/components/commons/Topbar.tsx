import { useSearchStore } from '@/stores/search.store';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { IoIosSearch, IoMdCart } from 'react-icons/io';
import { IoMail } from 'react-icons/io5';
import { LocalizedLink } from './LocalizedLink';
import ClientSearchHero from '../Home/ClientSearchHero';
import CartIcon from './CartIcon';
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
      <div className='container pb-2'>
         <div className='flex items-center justify-between gap-4 text-[#1D2C60]'>
            <LocalizedLink href='/' className='hidden items-center lg:flex'>
               <img
                  src={header?.logo?.data?.attributes?.url}
                  alt='logo'
                  className='h-10 w-24 object-contain md:h-[80px] md:w-[200px]'
               />
            </LocalizedLink>
            <div className='hidden flex-1 lg:block'>
               <div className='mx-auto max-w-[95%] [&>div>span]:block [&>div>span]:bg-[#C1CFEA] [&>div>span]:p-2 [&>div]:mt-0 [&>div]:w-full [&>div]:overflow-hidden [&>div]:rounded-md [&>div]:border-blue-1 [&>div]:p-0'>
                  <ClientSearchHero
                     placeholder='Search for reports, blogs, news, industries and more...'
                     variant='light'
                  />
               </div>
            </div>
            <div className='gtranslate_wrapper !relative lg:hidden'></div>
            <div className='flex items-center gap-2 sm:gap-6'>
               {/* <select title='Industry' id='' className='hidden md:block'>
                  {industries?.map((industry) => (
                     <option key={industry?.slug} value={industry?.slug}>
                        {industry?.name}
                     </option>
                  ))}
               </select> */}
               <div className='flex flex-col items-start gap-1 text-xs md:text-base'>
                  <p className='flex items-center gap-2'>
                     <FaPhoneAlt />
                     <span className='text-sm'>
                        <a
                           href={`tel:${header?.phoneNumber} ?? ''}`}
                           className='notranslate text-sm'
                        >
                           {header?.phoneNumber}
                        </a>
                     </span>
                  </p>
                  <p className='flex items-center gap-2'>
                     <IoMail />
                     <span>
                        <a
                           href={`mailto:${header?.email ?? ''}`}
                           className='notranslate text-sm'
                        >
                           {header?.email}
                        </a>
                     </span>
                  </p>
               </div>
               <CartIcon />
            </div>
         </div>
      </div>
   );
};

export default Topbar;
