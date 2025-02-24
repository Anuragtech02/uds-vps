'use client';
import React, { useState, useEffect } from 'react';
import { BiChevronUp } from 'react-icons/bi';

const BackToTop = () => {
   const [isVisible, setIsVisible] = useState(false);

   // Show button when page is scrolled up to given distance
   const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
         setIsVisible(true);
      } else {
         setIsVisible(false);
      }
   };

   // Set up scroll event listener
   useEffect(() => {
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
   }, []);

   // Scroll to top smoothly
   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      });
   };

   return (
      <>
         {isVisible && (
            <button
               onClick={scrollToTop}
               className='fixed bottom-8 left-8 right-auto z-50 rounded-full bg-blue-1 p-3 text-white shadow-lg ring-2 ring-white transition-all duration-300 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-blue-3 focus:ring-offset-2 md:bottom-44 md:left-auto md:right-8'
               aria-label='Back to top'
            >
               <BiChevronUp size={24} />
            </button>
         )}
      </>
   );
};

export default BackToTop;
