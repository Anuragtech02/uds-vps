import Image from 'next/image';
import logo from '@/assets/img/logo.png';
import Button from './Button';
import Link from 'next/link';
import industries from '@/utils/industries.json';
import { BiChevronDown } from 'react-icons/bi';

interface INavbarProps {
   header: {
      phoneNumber: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      logo?: { data: { attributes: { url?: string } } };
      ctaButton: { id: number; title: string; link: string };
   };
   mainMenu: any;
}
const Navbar = ({ header, mainMenu }: INavbarProps) => {
   function getMainMenuItems() {
      return mainMenu?.map((item: any) => {
         if (item?.children?.length > 0) {
            return (
               <li className='dropdown-menu relative flex cursor-pointer items-center'>
                  {item?.title} <BiChevronDown className='inline text-xl' />
                  <ul className='border-top absolute top-[100%] w-[320px] rounded-b-xl border border-s-400 bg-white font-medium text-s-800'>
                     {item?.children?.map((child: any, key: number) => (
                        <Link href={item?.url + child?.url ?? ''}>
                           <li
                              className='cursor-pointer border-t border-s-400 px-6 py-2 font-medium hover:font-bold'
                              key={key}
                           >
                              {child?.title}
                           </li>
                        </Link>
                     ))}
                  </ul>
               </li>
            );
         } else {
            return (
               <Link className='flex items-center' href={item?.url ?? ''}>
                  <li>{item?.title}</li>
               </Link>
            );
         }
      });
   }
   return (
      <div className='container'>
         <nav className='flex items-stretch justify-between rounded-xl bg-blue-2 px-6 py-0 md:px-8'>
            <Link href='/'>
               <img
                  src={header?.logo?.data?.attributes?.url}
                  alt='logo'
                  className='h-10 w-24 object-contain md:h-16 md:w-32'
               />
            </Link>
            <ul className='hidden items-stretch gap-4 text-white md:flex md:gap-6'>
               {getMainMenuItems()}
            </ul>
            <div className='flex items-center'>
               <Link href={header?.ctaButton?.link ?? ''}>
                  <Button>{header?.ctaButton?.title}</Button>
               </Link>
            </div>
         </nav>
      </div>
   );
};

export default Navbar;
