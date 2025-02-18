'use client';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';

const DUMMY_MARKETS = [
   'Energy Market',
   'Aerospace Market',
   'Automotive Market',
   'Agriculture Market',
   'Telecom & IT Market',
   'Chemical Market',
];

const TypewriterText: React.FC<{
   markets: string[];
   heading: string;
}> = ({ markets = DUMMY_MARKETS, heading }) => {
   const [text, setText] = useState('');
   const [marketIndex, setMarketIndex] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);

   const typeSpeed = 100;
   const deleteSpeed = 50;
   const pauseBeforeDelete = 2000;
   const pauseBeforeNextWord = 500;

   const typeEffect = useCallback(() => {
      const currentMarket = markets[marketIndex];

      if (isDeleting) {
         setText(currentMarket.substring(0, text.length - 1));
      } else {
         setText(currentMarket.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentMarket) {
         setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && text === '') {
         setIsDeleting(false);
         setMarketIndex((prevIndex) => (prevIndex + 1) % markets.length);
         setTimeout(() => {}, pauseBeforeNextWord);
      }
   }, [text, marketIndex, isDeleting]);

   useEffect(() => {
      const timer = setTimeout(
         typeEffect,
         isDeleting ? deleteSpeed : typeSpeed,
      );
      return () => clearTimeout(timer);
   }, [typeEffect, isDeleting]);

   function getHeadingTextSplit() {
      const splitted = heading.split('<DYNAMIC>');
      return {
         first: splitted[0],
         second: splitted[1],
      };
   }

   return (
      <>
         {getHeadingTextSplit().first}
         <span>{text}</span>
         <span className='caret'></span> <br /> {getHeadingTextSplit().second}
      </>
   );
};

const TypeWrapper: React.FC<{
   markets: string[];
   heading: string;
}> = ({ markets = DUMMY_MARKETS, heading }) => {
   const [containsLocale, setContainsLocale] = useState(false);
   const pathname = usePathname();
   const prevCookie = useRef(''); // Initialize as empty string - no document yet

   useEffect(() => {
      // **Check if 'document' is defined (browser environment)**
      if (typeof document !== 'undefined') {
         prevCookie.current = document.cookie; // Initialize *only* in browser
         const checkCookieAndPathname = () => {
            const hasCookie = document.cookie.includes('googtrans=');
            setContainsLocale(
               hasCookie ||
                  SUPPORTED_LOCALES.some(
                     (loc) =>
                        pathname.startsWith(`/${loc}/`) ||
                        pathname === `/${loc}`,
                  ),
            );
         };

         checkCookieAndPathname(); // Initial check in browser

         const intervalId = setInterval(() => {
            if (document.cookie !== prevCookie.current) {
               // Cookie has changed!
               prevCookie.current = document.cookie; // Update in browser
               checkCookieAndPathname(); // Rerun logic in browser
            }
         }, 500);

         return () => {
            clearInterval(intervalId); // Cleanup in browser
         };
      }
   }, [pathname]);

   return !containsLocale ? (
      <TypewriterText markets={markets} heading={heading} />
   ) : (
      <>
         Unlock <br /> <span>Industry Insights</span> with Comprehensive
         research
      </>
   );
};

export default TypeWrapper;
