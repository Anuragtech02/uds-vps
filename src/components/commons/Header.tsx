'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { usePathname } from 'next/navigation';
import { Media } from '../StrapiImage/StrapiImage';
interface IHeader {
   phoneNumber: string;
   email: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   logo?: Media  ;
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
   const navRef = useRef<HTMLDivElement | null>(null);
   const pathname = usePathname();
   
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
