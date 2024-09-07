'use client';
import Button from '../commons/Button';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import StrapiImage from '../StrapiImage/StrapiImage';
import { CalendarSvg, CommentSvg, TagIcon } from '../commons/Icons';

const industries = [
   'AI in drug discovery',
   'AI in clinical trials',
   'AI in genomics',
];

const Header: React.FC<{}> = () => {
   const headerRef1 = useRef<HTMLDivElement>(null);
   const headerRef2 = useRef<HTMLDivElement>(null);
   const [showSecondHeader, setShowSecondHeader] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         const header1Height = headerRef1.current?.clientHeight || 0;
         setShowSecondHeader(scrollPosition > header1Height + 110);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   useEffect(() => {
      if (showSecondHeader && headerRef2.current) {
         gsap.fromTo(
            headerRef2.current,
            { y: -50, opacity: 0, delay: 0.3 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
         );
      }
   }, [showSecondHeader]);

   return (
      <>
         <div
            className={`w-full bg-white py-4 transition-all duration-300`}
            ref={headerRef1}
         >
            <div className='container'>
               <div className='flex gap-8'>
                  <div className='mx-auto w-full space-y-4 font-semibold md:w-2/3 md:space-y-6'>
                     <h2 className='mx-auto text-center font-bold'>
                        Artificial Intelligence the Future of Drug Discovery in
                        the United States
                     </h2>
                     <div className='mx-auto flex flex-wrap justify-center gap-3'>
                        {industries.map((industry, index) => (
                           <div
                              key={index}
                              className='flex items-center gap-2 rounded-full border border-s-300 bg-s-100 px-4 py-1 text-blue-4'
                           >
                              <TagIcon /> {industry}
                           </div>
                        ))}
                     </div>
                     <div className='flex justify-between border-y border-s-300 py-4'>
                        <div className='flex items-center gap-4'>
                           <img
                              src=''
                              alt=''
                              className='h-12 w-12 rounded-full'
                           />
                           <p className='text-s-600'>Vikas Kumar</p>
                        </div>

                        <div className='flex items-center gap-4'>
                           <div className='flex items-center gap-2 text-s-600'>
                              <CalendarSvg /> <p>12th Aug 2021</p>
                           </div>
                           <div className='flex items-center gap-2 text-s-600'>
                              <CommentSvg /> <p>0 comments</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {showSecondHeader && (
            <div
               className={`sticky left-0 right-0 top-[130px] z-20 border-b border-s-300 bg-white py-4 transition-all duration-300`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex items-start justify-between gap-6'>
                     <h3 className='w-2/3 font-bold'>
                        Artificial Intelligence the Future of Drug Discovery in
                        the United States
                     </h3>
                     <div className='flex items-center justify-end gap-2 py-4'></div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Header;
