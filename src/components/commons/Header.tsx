'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';

const Header = () => {
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
         className={`${!isSticky ? 'fixed' : 'sticky'} left-0 top-0 z-50 w-full border-b border-s-300 bg-white py-4`}
         key='header'
      >
         <Topbar />
         <Navbar />
      </div>
   );
};

export default Header;
