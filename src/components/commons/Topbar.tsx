import { FaPhoneAlt } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { LocalizedLink } from './LocalizedLink';
import ClientSearchHero from '../Home/ClientSearchHero';
import CartIcon from './CartIcon';
import StrapiImage, { Media } from '../StrapiImage/StrapiImage';

interface ITopbarProps {
   header: {
      phoneNumber: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      logo?: Media;
      ctaButton: { id: number; title: string; link: string };
   };
}
const Topbar = ({ header }: ITopbarProps) => {
   return (
      <div className='container pb-2'>
         <div className='flex items-center justify-between gap-4 text-[#1D2C60]'>
            <LocalizedLink href='/' className='hidden items-center lg:flex'>
               <StrapiImage
                  media={header?.logo as Media}
                  size='original'
                  alt='logo'
                  width={200}
                  height={80}
                  loading='eager'
                  className='h-10 w-24 object-contain md:h-[80px] md:w-[200px]'
                  wrapperClassName='h-10 w-24 object-contain md:h-[80px] md:w-[200px] flex justify-start items-center'
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
               <div className='flex flex-col items-start gap-1 text-xs md:text-base'>
                  <p className='flex items-center gap-2'>
                     <FaPhoneAlt />
                     <span className='text-sm'>
                        <a
                           href={`tel:${header?.phoneNumber ?? ''}`}
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
