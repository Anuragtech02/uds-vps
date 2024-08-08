'use client';
import placeholderImage from '@/assets/img/sampleResearch.png';
import Button from '../commons/Button';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Header = () => {
   const headerRef1 = useRef<HTMLDivElement>(null);
   const headerRef2 = useRef<HTMLDivElement>(null);
   const [showSecondHeader, setShowSecondHeader] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         const header1Height = headerRef1.current?.clientHeight || 0;
         setShowSecondHeader(scrollPosition > header1Height + 130);
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
                  <div className='aspect-square h-[200px] rounded-md border border-s-300'>
                     <img
                        className='h-full w-full rounded-md object-cover'
                        src={placeholderImage.src}
                        alt='report'
                     />
                  </div>
                  <div className='flex flex-col justify-center gap-4 font-semibold'>
                     <div className='flex items-start justify-between gap-6'>
                        <h3 className='w-2/3 font-bold'>
                           Asia Pacific Battery Recycling Market: Current
                           Analysis and Forecast (2024-2032)
                        </h3>
                        <div className='rounded-full bg-s-200 px-8 py-4 md:text-2xl'>
                           <p className='text-blue-3'>$3999-$5999</p>
                        </div>
                     </div>
                     <p className='font-medium text-s-700'>
                        Unlock the potential for sustained growth with
                        Univdatos’s US Suncare and Skin Protection Market Report
                        2024. Our comprehensive report is designed to provide
                        you with unparalleled insights and strategic guidance to
                        navigate the dynamic landscape of the suncare industry.
                        Gain a competitive edge with in-depth analysis of market
                        trends, consumer behavior, and key challenges and
                        opportunities facing the industry. Stay ahead of the
                        curve and make informed decisions with our 360° view of
                        the market, including a five-year forecast.
                     </p>

                     <div className='flex items-end justify-between'>
                        <div className='flex flex-col gap-4'>
                           <div className='flex items-center gap-4'>
                              <div className='flex items-center gap-2'>
                                 <p className='text-lg text-s-500'>Page:</p>
                                 <p className='text-xl text-blue-4'>65</p>
                              </div>
                              <div className='flex items-center gap-2'>
                                 <p className='text-lg text-s-500'>Table:</p>
                                 <p className='text-xl text-blue-4'>65</p>
                              </div>
                              <div className='flex items-center gap-2'>
                                 <p className='text-lg text-s-500'>Figure:</p>
                                 <p className='text-xl text-blue-4'>65</p>
                              </div>
                           </div>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>Geography:</p>
                              <p className='text-xl text-blue-4'>
                                 Asia-Pacific
                              </p>
                           </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>
                                 Report ID & SKU:
                              </p>
                              <p className='text-xl text-blue-4'>UMEP212790</p>
                           </div>
                           <div className='flex items-center gap-2'>
                              <p className='text-lg text-s-500'>Categories:</p>
                              <p className='text-xl text-blue-4'>
                                 Energy and Power, Industry Reports
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className='flex items-center justify-end gap-2 py-4'>
                        <Button variant='light'>Download Report</Button>
                        <Button variant='secondary'>Buy Now</Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {showSecondHeader && (
            <div
               className={`sticky left-0 right-0 top-[136px] z-20 bg-white py-4 transition-all duration-300`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex items-start justify-between gap-6'>
                     <h3 className='w-2/3 font-bold'>
                        Asia Pacific Battery Recycling Market: Current Analysis
                        and Forecast (2024-2032)
                     </h3>
                     <div className='flex items-center justify-end gap-2 py-4'>
                        <Button variant='light'>Download Report</Button>
                        <Button variant='secondary'>Buy Now</Button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Header;
