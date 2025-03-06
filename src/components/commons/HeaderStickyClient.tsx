'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const HeaderStickyClient = () => {
   const pathname = usePathname();

   useEffect(() => {
      const header = document.getElementById('main-header');
      if (header) {
         const pageUrl = window.location.pathname;
         const stickyUrl = ['/reports/'];
         const isSticky = stickyUrl.some((url) => pageUrl.includes(url));
         if (isSticky) {
            header.style.position = 'relative';
         } else {
            header.style.position = 'fixed';
            header.style.left = '0';
         }
      }
   }, [pathname]);

   return <></>;
};

export default HeaderStickyClient;
