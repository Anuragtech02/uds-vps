'use client';
import Button from '../commons/Button';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import StrapiImage from '../StrapiImage/StrapiImage';

const Header: React.FC<{ data: any }> = ({ data }) => {
   const reportHeaderData = {
      title: data.attributes.title,
      shortDescription: data.attributes.shortDescription,
      medusaID: data.attributes.medusaID,
      reportID: data.attributes.reportID,
      geography: {
         name: data.attributes.geography.data.attributes.name,
         slug: data.attributes.geography.data.attributes.slug,
      },
      industry: {
         name: data.attributes.industry.data.attributes.name,
         slug: data.attributes.industry.data.attributes.slug,
      },
      heroSectionPrimaryCTA: {
         title: data.attributes.heroSectionPrimaryCTA.title,
         link: data.attributes.heroSectionPrimaryCTA.link,
      },
      heroSectionSecondaryCTA: {
         title: data.attributes.heroSectionSecondaryCTA.title,
         link: data.attributes.heroSectionSecondaryCTA.link,
      },
      totalPagesCount: data.attributes.totalPagesCount,
      tablesCount: data.attributes.tablesCount,
      figuresCount: data.attributes.figuresCount,
      highlightImage: data.attributes.highlightImage,
      updatedAt: data.attributes.updatedAt,
   };

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
               <div className='flex flex-col gap-8 md:flex-row'>
                  <div className='h-[200px] rounded-md border border-s-300 md:aspect-square'>
                     <StrapiImage
                        media={reportHeaderData.highlightImage.data.attributes}
                        objectFit='contain'
                        className='!h-[200px] !object-contain'
                     />
                  </div>
                  <div className='flex flex-col justify-center gap-4 font-semibold'>
                     <div className='flex items-start justify-between gap-6'>
                        <h3 className='font-bold lg:w-2/3'>
                           {reportHeaderData.title}
                        </h3>
                     </div>
                     <p className='font-medium text-s-700'>
                        {reportHeaderData.shortDescription}
                     </p>

                     <div className='flex flex-wrap items-center gap-4'>
                        <div className='flex items-center gap-2'>
                           <p className='text-lg text-s-500'>Geography:</p>
                           <p className='text-xl text-blue-4'>
                              {reportHeaderData.geography.name}
                           </p>
                        </div>

                        <div className='flex items-center gap-2'>
                           <p className='text-lg text-s-500'>Industry:</p>
                           <p className='text-xl text-blue-4'>
                              {reportHeaderData.industry.name}
                           </p>
                        </div>
                        <div className='flex items-center gap-2'>
                           <p className='text-lg text-s-500'>Last updated:</p>
                           <p
                              className='text-xl text-blue-4'
                              suppressHydrationWarning
                           >
                              {new Date(
                                 reportHeaderData?.updatedAt,
                              )?.toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                     <div className='flex items-center justify-end gap-2 py-4'>
                        <Button
                           variant='light'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0'
                        >
                           {reportHeaderData.heroSectionPrimaryCTA.title}
                        </Button>
                        <Button
                           variant='secondary'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0'
                        >
                           {reportHeaderData.heroSectionSecondaryCTA.title}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {showSecondHeader && (
            <div
               className={`sticky left-0 right-0 top-[140px] z-20 border-b border-s-300 bg-white py-4 transition-all duration-300`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:gap-6'>
                     <h3 className='font-bold lg:w-2/3'>
                        {reportHeaderData.title}
                     </h3>
                     <div className='flex w-full items-center justify-end gap-2 py-4 md:w-max'>
                        <Button
                           variant='light'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0'
                        >
                           {reportHeaderData.heroSectionPrimaryCTA.title}
                        </Button>
                        <Button
                           variant='secondary'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0'
                        >
                           {reportHeaderData.heroSectionSecondaryCTA.title}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Header;
