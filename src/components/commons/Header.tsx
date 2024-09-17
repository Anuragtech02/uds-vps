'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
interface IHeader {
   phoneNumber: string;
   email: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   logo?: { data: { attributes: { url?: string } } };
   ctaButton: { id: number; title: string; link: string };
}
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
         className={`w-full border-b border-s-300 bg-white py-4`}
         key='header'
      >
         <Topbar header={header} industries={industries} />
         <Navbar header={header} mainMenu={mainMenu} />
      </div>
   );
};

export default Header;
