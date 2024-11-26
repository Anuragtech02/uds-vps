'use client';
import React, { Fragment, useEffect } from 'react';

const HandleRTL = () => {
   useEffect(() => {
      function checkAndUpdateRTL(selectedLang: string) {
         if (selectedLang === 'en|ar') {
            document.body.classList.add('rtl');
         } else {
            document.body.classList.remove('rtl');
         }
      }

      function langChangeListener(e: Event) {
         const selectedLang = (e.target as HTMLSelectElement).value;
         checkAndUpdateRTL(selectedLang);
      }

      if (typeof window !== 'undefined') {
         //  setTimeout(() => {
         const el = document.querySelector('.gt_selector') as HTMLSelectElement;
         console.log('This is window', el);
         if (el) {
            const selectedLang = el.value;
            checkAndUpdateRTL(selectedLang);
            el.addEventListener('change', langChangeListener);
         }
         //  }, 500);
      }

      return () => {
         if (typeof window !== 'undefined') {
            const el = document.querySelector(
               '.gt_selector',
            ) as HTMLSelectElement;
            if (el) {
               el.removeEventListener('change', langChangeListener);
            }
         }
      };
   });

   return <Fragment></Fragment>;
};

export default HandleRTL;
