'use client';
import Button from '../commons/Button';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import StrapiImage from '../StrapiImage/StrapiImage';
import Link from 'next/link';
import { getCTALink } from '@/utils/generic-methods';
import { cacheRecentReports } from '@/utils/cache-recent-reports.utils';

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
      if (data?.attributes) cacheRecentReports(data?.attributes);
   }, []);

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

   function getMonthDate(date: Date) {
      const dateObj = new Date(date);
      if (!dateObj) {
         return '';
      }

      const monthNames = [
         'January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December',
      ];
      const monthIndex = dateObj.getMonth();
      const day = dateObj.getDate();

      return `${monthNames[monthIndex]} ${day}`;
   }
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
                              {getMonthDate(reportHeaderData?.updatedAt)}
                           </p>
                        </div>
                     </div>
                     <div className='flex items-center justify-end gap-2 py-4'>
                        <Button
                           variant='light'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0 md:basis-[unset]'
                        >
                           {reportHeaderData.heroSectionPrimaryCTA.title}
                        </Button>
                        <Button
                           variant='secondary'
                           className='shrink grow basis-0 md:shrink-0 md:grow-0 md:basis-[unset]'
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
               className={`sticky left-0 right-0 top-[0px] z-20 border-b border-s-300 bg-white py-4 transition-all duration-300`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-6'>
                     <h4 className='w-full overflow-hidden truncate text-ellipsis font-bold sm:text-wrap lg:w-2/3'>
                        {reportHeaderData.title}
                     </h4>
                     <div className='flex w-full flex-col items-center justify-end gap-2 sm:max-w-max sm:flex-row sm:py-4'>
                        <Link
                           href={getCTALink(
                              reportHeaderData.heroSectionPrimaryCTA.link,
                           )}
                        >
                           <Button
                              variant='light'
                              className='w-full min-w-[200px] shrink grow basis-0 sm:!max-w-[250px] md:shrink-0 md:grow-0 md:basis-[unset]'
                           >
                              {reportHeaderData.heroSectionPrimaryCTA.title}
                           </Button>
                        </Link>
                        <Link
                           href={getCTALink(
                              reportHeaderData.heroSectionSecondaryCTA.link,
                           )}
                        >
                           <Button
                              variant='secondary'
                              className='w-full min-w-[150px] shrink grow basis-0 sm:!max-w-[200px] md:shrink-0 md:grow-0 md:basis-[unset]'
                           >
                              {reportHeaderData.heroSectionSecondaryCTA.title}
                           </Button>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Header;
