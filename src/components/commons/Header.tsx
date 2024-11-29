'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { usePathname } from 'next/navigation';
interface IHeader {
   phoneNumber: string;
   email: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   logo?: { data: { attributes: { url?: string } } };
   ctaButton: { id: number; title: string; link: string };
}

const STICKY_URL = ['/reports/'];

const Header = ({
   header,
   industries,
   mainMenu,
}: {
   header: IHeader;
   industries: any;
   mainMenu: any;
}) => {
   const [isSticky, setSticky] = useState(false);
   const navRef = useRef<HTMLDivElement | null>(null);
   const pathname = usePathname();

   const handleScroll = () => {
      if (navRef.current) {
         setSticky(navRef.current?.getBoundingClientRect().top <= 0);
      }
   };

   useEffect(() => {
      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', () => handleScroll);
      };
   }, []);

   return (
      <div
         className={`${
            STICKY_URL.some((url) => pathname.includes(url))
               ? ''
               : 'fixed left-0 top-0 z-50'
         } w-full border-b border-s-300 bg-white py-4`}
         key='header'
      >
         <Topbar header={header} industries={industries} />
         <Navbar header={header} mainMenu={mainMenu} industries={industries} />
      </div>
   );
};

export default Header;
