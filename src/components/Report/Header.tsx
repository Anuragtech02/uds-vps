'use client';
import Button from '../commons/Button';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import StrapiImage from '../StrapiImage/StrapiImage';
import { getCTALink } from '@/utils/generic-methods';
import { cacheRecentReports } from '@/utils/cache-recent-reports.utils';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/utils/cart-utils.util';
import { LocalizedLink } from '../commons/LocalizedLink';

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
      oldPublishedAt: data.attributes.oldPublishedAt,
   };

   const headerRef1 = useRef<HTMLDivElement>(null);
   const headerRef2 = useRef<HTMLDivElement>(null);
   const [showSecondHeader, setShowSecondHeader] = useState(false);
   const router = useRouter();
   const selectedLicenses: { selectedLicenses: { [key: number]: any } } =
      useSelectedLicenseStore();

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
         'Jan',
         'Feb',
         'Mar',
         'Apr',
         'May',
         'Jun',
         'Jul',
         'Aug',
         'Sep',
         'Oct',
         'Nov',
         'Dec',
      ];
      const monthIndex = dateObj.getMonth();
      const year = dateObj.getFullYear();

      return `${monthNames[monthIndex]} ${year}`;
   }
   const handleBuyNow = () => {
      let selectedLicense =
         !isNaN(data?.id) &&
         selectedLicenses.selectedLicenses?.[parseInt(data?.id)];
      if (!selectedLicense) {
         return alert('Please select a license');
      }
      addToCart({ id: data?.id, ...data?.attributes }, selectedLicense);
      router.push('/cart');
   };

   return (
      <>
         <div
            className={`w-full bg-white py-4 transition-all duration-300`}
            ref={headerRef1}
         >
            <div className='container'>
               <div className='flex flex-col gap-8 md:flex-row'>
                  {/* <div className='h-[200px] rounded-md border border-s-300 md:aspect-square'>
                     <StrapiImage
                        media={reportHeaderData.highlightImage.data.attributes}
                        objectFit='contain'
                        className='!h-[200px] !object-contain'
                     />
                  </div> */}
                  <div className='flex w-full flex-col justify-center gap-4 font-semibold'>
                     <div className='flex items-start justify-between gap-6'>
                        <h1 className='h3 font-bold lg:w-2/3'>
                           {reportHeaderData.title}
                        </h1>
                     </div>
                     <p className='font-medium text-s-700 md:text-lg'>
                        {reportHeaderData.shortDescription}
                     </p>

                     <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div className='flex flex-wrap items-center gap-4'>
                           <div className='flex items-center gap-2'>
                              <p className='text-md text-s-500'>Geography:</p>
                              <p className='text-md text-blue-4 hover:underline'>
                                 <LocalizedLink
                                    href={`/reports/?geographies=${reportHeaderData.geography.slug}`}
                                 >
                                    {reportHeaderData.geography.name}
                                 </LocalizedLink>
                              </p>
                           </div>

                           <div className='flex items-center gap-2'>
                              <p className='text-md text-s-500'>Industry:</p>
                              <p className='text-md text-blue-4 hover:underline'>
                                 <LocalizedLink
                                    href={`/reports/?industries=${reportHeaderData.industry.slug}`}
                                 >
                                    {reportHeaderData.industry.name}
                                 </LocalizedLink>
                              </p>
                           </div>
                           <div className='flex items-center gap-2'>
                              <p className='text-md text-s-500'>
                                 Last updated:
                              </p>
                              <p
                                 className='text-md text-blue-4'
                                 suppressHydrationWarning
                              >
                                 {getMonthDate(reportHeaderData?.oldPublishedAt || reportHeaderData.updatedAt)}
                              </p>
                           </div>
                        </div>

                        <div className='flex w-full items-center gap-2 md:w-auto'>
                           <LocalizedLink href='?popup=report-enquiry'>
                              <Button
                                 variant='secondary'
                                 className='shrink grow basis-0 md:shrink-0 md:grow-0 md:basis-[unset]'
                              >
                                 {reportHeaderData.heroSectionPrimaryCTA.title}
                              </Button>
                           </LocalizedLink>

                           <Button
                              variant='light'
                              className='shrink grow basis-0 md:shrink-0 md:grow-0 md:basis-[unset]'
                              onClick={handleBuyNow}
                           >
                              {reportHeaderData.heroSectionSecondaryCTA.title?.replace(
                                 'Purchase',
                                 'Buy',
                              )}
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {showSecondHeader && (
            <div
               className={`fixed bottom-0 left-0 right-0 z-20 border-b border-s-300 bg-white py-4 transition-all duration-300 md:sticky md:bottom-[unset] md:top-0`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-6'>
                     <div className='flex flex-col lg:flex-row justify-start items-center gap-2'>
                        <StrapiImage
                           media={{
                              url: 'https://udsweb.s3.ap-south-1.amazonaws.com/logo_dark_91bf6337d3.svg',
                              width: 100,
                              height: 50,
                           }}
                           objectFit='contain'
                           className='!h-[20px] !object-contain'
                        />
                        <h5 className='hidden w-full overflow-hidden truncate text-ellipsis font-bold sm:text-wrap md:block lg:w-2/3'>
                           {reportHeaderData.title}
                        </h5>
                     </div>
                     <div className='flex w-full items-center gap-2 md:max-w-max md:justify-end'>
                        <LocalizedLink
                           href={getCTALink(
                              reportHeaderData.heroSectionPrimaryCTA.link,
                           )}
                           className='shrink grow basis-0 md:min-w-[200px] md:!max-w-[250px] md:shrink-0 md:grow-0 md:basis-[unset]'
                        >
                           <Button variant='secondary' className='w-full'>
                              {reportHeaderData.heroSectionPrimaryCTA.title}
                           </Button>
                        </LocalizedLink>
                        <div className='shrink grow basis-0 md:min-w-[200px] md:!max-w-[250px] md:shrink-0 md:grow-0 md:basis-[unset]'>
                           <Button
                              variant='light'
                              className='w-full'
                              onClick={handleBuyNow}
                           >
                              {reportHeaderData.heroSectionSecondaryCTA.title}
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Header;
