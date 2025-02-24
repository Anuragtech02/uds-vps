'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../commons/Button';
import ReportBlockData from './ReportBlockData';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import CollapsibleLicenseOptions from './CollapsibleList';
import Popup from '../Popup';
import ReportEnquiryForm from './ReportEnquiryForm';
import SampleReportDownloadForm from './SampleReportDownloadForm';
import { getCTALink } from '@/utils/generic-methods';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import {
   addToCart,
   getLicenseOfReport,
   License,
   setLicenseOfReport,
} from '@/utils/cart-utils.util';
import { useRouter } from 'next/navigation';
import ReportFAQs from './ReportFAQs';
import { LocalizedLink } from '../commons/LocalizedLink';
import MobileReportBlock from './MobileReportIndex';
import Breadcrumbs from './Breadcrumbs';

// Define type for report variants
export interface Variant {
   title: string;
   description: string;
   price: {
      amount: number;
      currency: string;
   };
}

// Define type for report data
interface ReportData {
   id: number;
   title: string;
   aboutReport: string;
   tableOfContent: string;
   researchMethodology: string;
   description: string;
   faqSectionHeading: string;
   industry: {
      name: string;
      slug: string;
   };
   faqList: any; // Replace `any` with a specific type if available
   relatedReportsSectionHeading: string;
   relatedReportsSectionReportsCount: number;
   relatedReportsSectionSubheading: string;
   clientsSectionHeading: string;
   ctaBanner: any; // Replace `any` with a specific type if available
   leftSectionPrimaryCTAButton: {
      title: string;
      link: string;
   };
   leftSectionSecondaryCTAButton: {
      title: string;
      link: string;
   };
   rightSectionHeading: string;
}

// Component props
interface ReportBlockProps {
   data: {
      id: number;
      attributes: {
         title: string;
         aboutReport: string;
         tableOfContent: string;
         researchMethodology: string;
         description: string;
         faqSectionHeading: string;
         industry: {
            data: {
               attributes: {
                  name: string;
                  slug: string;
               };
            };
         };
         faqList: any;
         relatedReportsSectionHeading: string;
         relatedReportsSectionReportsCount: number;
         relatedReportsSectionSubheading: string;
         clientsSectionHeading: string;
         ctaBanner: any;
         leftSectionPrimaryCTAButton: {
            title: string;
            link: string;
         };
         leftSectionSecondaryCTAButton: {
            title: string;
            link: string;
         };
         rightSectionHeading: string;
         variants: {
            title: string;
            description: string;
            price: {
               amount: number;
               currency: string;
            };
         }[];
      };
   };
}

const reportIndex = [
   // { title: 'About this report', id: 'about-report' },
   { title: 'Report Description', id: 'report-data' },
   { title: 'Table of content', id: 'table-of-content' },
   { title: 'Research Methodology', id: 'research-methodology' },
   { title: 'FAQs', id: 'faq-section' },
];

// Custom hook for middle-screen detection
const useMiddleScreenScrollSpy = (sectionIds: string[]) => {
   const [activeSection, setActiveSection] = useState(sectionIds[0]);
   const sections = useRef<Array<{ id: string; top: number; bottom: number }>>(
      [],
   );
   const rafId = useRef<number>();
   const headerHeight = useRef(0);

   const calculatePositions = useCallback(() => {
      headerHeight.current =
         document.querySelector('header')?.clientHeight || 0;

      sections.current = sectionIds.map((id) => {
         const el = document.getElementById(id);
         if (!el) return { id, top: 0, bottom: 0 };

         const rect = el.getBoundingClientRect();
         return {
            id,
            top: rect.top + window.scrollY - headerHeight.current,
            bottom: rect.bottom + window.scrollY - headerHeight.current,
         };
      });
   }, [sectionIds]);

   const handleScroll = useCallback(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let closestSection = activeSection;
      let smallestDistance = Infinity;

      sections.current.forEach(({ id, top, bottom }) => {
         if (scrollPosition >= top && scrollPosition <= bottom) {
            const distance = Math.abs(scrollPosition - (top + bottom) / 2);
            if (distance < smallestDistance) {
               smallestDistance = distance;
               closestSection = id;
            }
         }
      });

      if (closestSection !== activeSection) {
         setActiveSection(closestSection);
      }
   }, [activeSection]);

   useEffect(() => {
      // Initial calculation
      calculatePositions();

      // Throttled scroll handler
      const scrollThrottle = () => {
         if (!rafId.current) {
            rafId.current = requestAnimationFrame(() => {
               handleScroll();
               rafId.current = undefined;
            });
         }
      };

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
         calculatePositions();
         handleScroll();
      });

      // Observe all sections
      sectionIds.forEach((id) => {
         const el = document.getElementById(id);
         if (el) resizeObserver.observe(el);
      });

      window.addEventListener('scroll', scrollThrottle);
      window.addEventListener('resize', calculatePositions);

      return () => {
         window.removeEventListener('scroll', scrollThrottle);
         window.removeEventListener('resize', calculatePositions);
         resizeObserver.disconnect();
         if (rafId.current) cancelAnimationFrame(rafId.current);
      };
   }, [calculatePositions, handleScroll, sectionIds]);

   return activeSection;
};

const scrollToSection = (id: string) => {
   const element = document.getElementById(id);
   if (element) {
      const headerOffset = 200; // Add margin from top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
         elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
         top: offsetPosition,
         behavior: 'smooth',
      });
   }
};

const ReportBlock: React.FC<ReportBlockProps> = ({ data }) => {
   const reportData: ReportData = {
      id: data.id,
      title: data.attributes.title,
      aboutReport: data.attributes?.aboutReport || '',
      tableOfContent: data.attributes.tableOfContent,
      researchMethodology: data.attributes.researchMethodology,
      description: data.attributes.description,
      faqSectionHeading: data.attributes.faqSectionHeading,
      industry: {
         name: data.attributes.industry.data.attributes.name,
         slug: data.attributes.industry.data.attributes.slug,
      },
      faqList: data.attributes.faqList,
      relatedReportsSectionHeading:
         data.attributes.relatedReportsSectionHeading,
      relatedReportsSectionReportsCount:
         data.attributes.relatedReportsSectionReportsCount,
      relatedReportsSectionSubheading:
         data.attributes.relatedReportsSectionSubheading,
      clientsSectionHeading: data.attributes.clientsSectionHeading,
      ctaBanner: data.attributes.ctaBanner,
      leftSectionPrimaryCTAButton: data.attributes.leftSectionPrimaryCTAButton,
      leftSectionSecondaryCTAButton:
         data.attributes.leftSectionSecondaryCTAButton,
      rightSectionHeading: data.attributes.rightSectionHeading,
   };

   const variants: Variant[] = data.attributes.variants.map((variant) => ({
      title: variant.title,
      description: variant.description,
      price: {
         amount: variant.price.amount,
         currency: variant.price.currency,
      },
   }));

   const [selectedIndex, setSelectedIndex] = useState<number>(0);
   const [selectedLicense, setSelectedLicense] = useState<number | null>(null);
   const selectedLicenses = useSelectedLicenseStore();
   const router = useRouter();

   const sectionIds = reportIndex.map((item) => item.id);
   const activeSection = useMiddleScreenScrollSpy(sectionIds);

   useEffect(() => {
      if (selectedLicense === null || isNaN(selectedLicense)) return;

      const license = variants[selectedLicense] ?? null;
      selectedLicenses.selectLicense(reportData.id, license);
      setLicenseOfReport(reportData.id, license);
   }, [selectedLicense]);

   useEffect(() => {
      const alreadySelectedLicense = getLicenseOfReport(reportData.id);

      if (alreadySelectedLicense) {
         setSelectedLicense(
            variants.findIndex(
               (variant) => variant.title === alreadySelectedLicense.title,
            ),
         );
         selectedLicenses.selectLicense(
            reportData.id,
            getLicenseOfReport(reportData.id) as License,
         );
      }
   }, []);

   const handleBuyNow = () => {
      // @ts-ignore
      let selectedLicense = selectedLicenses.selectedLicenses[reportData.id];
      if (!selectedLicense) {
         // select single user by default
         selectedLicense = variants.find((variant) =>
            variant.title?.includes('Single User'),
         );
      }

      // @ts-ignore
      addToCart({ id: data.id, ...data.attributes }, selectedLicense);
      router.push('/cart');
   };

   // useEffect(() => {
   //    const header = document.getElementById('report-header');
   //    const headerHeight = header?.clientHeight || 80;

   //    const observer = new IntersectionObserver(
   //       (entries) => {
   //          entries.forEach((entry) => {
   //             if (entry.isIntersecting) {
   //                setActiveSection(entry.target.id);
   //                const newIndex = reportIndex.findIndex(
   //                   (item) => item.id === entry.target.id,
   //                );
   //                if (newIndex !== -1) setSelectedIndex(newIndex);
   //             }
   //          });
   //       },
   //       {
   //          rootMargin: `-${headerHeight}px 0px 0px 0px`, // Compensate for header height
   //          threshold: 0.5,
   //       },
   //    );

   //    // Observe all sections
   //    reportIndex.forEach(({ id }) => {
   //       const element = document.getElementById(id);
   //       if (element) observer.observe(element);
   //    });

   //    return () => {
   //       reportIndex.forEach(({ id }) => {
   //          const element = document.getElementById(id);
   //          if (element) observer.unobserve(element);
   //       });
   //    };
   // }, []);

   return (
      <div className='container py-10 md:py-16 md:pt-10'>
         <Breadcrumbs
            industry={{
               name: reportData.industry.name,
               slug: reportData.industry.slug,
            }}
         />
         <div className='flex flex-col items-start gap-4 lg:flex-row'>
            <div className='sticky top-[100px] hidden flex-[0.23] flex-col gap-6 lg:flex'>
               <div className='w-full rounded-md border border-s-400 bg-white'>
                  <ul className='list-none p-0'>
                     {reportIndex
                        .filter((idx) =>
                           idx.title === 'FAQs'
                              ? reportData.faqList?.length > 0
                              : true,
                        )
                        .map((item, index) => (
                           <li
                              key={index}
                              className={`cursor-pointer px-4 py-2 transition-all duration-150 ${
                                 item.id === activeSection
                                    ? 'border-y border-s-300 bg-blue-2 font-semibold text-white'
                                    : ''
                              }`}
                              onClick={() => {
                                 setSelectedIndex(index);
                                 scrollToSection(item.id);
                              }}
                           >
                              {item.title}
                           </li>
                        ))}
                  </ul>
               </div>
               <div className='w-full rounded-md border border-s-400 bg-white px-4 py-6 pt-4'>
                  <p className='text-center text-lg font-semibold'>
                     {/* This is {reportData.rightSectionHeading} */}
                     License Options
                  </p>
                  <CollapsibleLicenseOptions
                     variants={variants}
                     selectedLicense={selectedLicense}
                     setSelectedLicense={setSelectedLicense}
                  />
               </div>
               <div className='relative mt-3'>
                  <Button
                     className='w-full py-3'
                     variant='secondary'
                     onClick={handleBuyNow}
                  >
                     {/* {reportData.leftSectionPrimaryCTAButton.title?.replace(
                        'Purchase',
                        'Buy',
                     )} */}
                     Buy Now
                  </Button>
               </div>
               <LocalizedLink
                  // href={getCTALink(
                  //    reportData.leftSectionSecondaryCTAButton.link,
                  // )}
                  href={getCTALink('?popup=report-enquiry')}
               >
                  <Button className='w-full py-3' variant='light'>
                     {/* {reportData.leftSectionSecondaryCTAButton.title} */}
                     Request For Customization
                  </Button>
               </LocalizedLink>
            </div>
            <div className='flex-[0.77]'>
               <ReportBlockData data={reportData} />
               {data?.attributes?.faqList?.length > 0 && (
                  <ReportFAQs data={data} />
               )}
            </div>
         </div>
         <MobileReportBlock
            reportIndex={reportIndex}
            variants={variants}
            selectedLicense={selectedLicense}
            setSelectedLicense={setSelectedLicense}
            rightSectionHeading={reportData.rightSectionHeading}
         />

         <Popup name='report-enquiry' title='Report Enquiry' size='lg'>
            <ReportEnquiryForm
               reportTitle={reportData.title}
               reportId={reportData.id}
            />
         </Popup>
         <Popup name='sample-report' title='Get Sample Report'>
            <SampleReportDownloadForm
               reportTitle={reportData.title}
               reportId={reportData.id}
            />
         </Popup>
      </div>
   );
};

export default ReportBlock;
