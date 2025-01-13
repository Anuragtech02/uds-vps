'use client';

import { useEffect, useState } from 'react';
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

   const scrollIntoView = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
         const yOffset = -200; // Adjust this value to provide padding/margin from top
         const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
         window.scrollTo({ top: y, behavior: 'smooth' });
      }
   };

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

   return (
      <div className='container py-10 md:py-16 md:pt-10'>
         <div className='flex items-center gap-2 pb-10 md:text-lg'>
            <p className='hover:blue-5 hover:underline'>
               <LocalizedLink href='/'>Home</LocalizedLink>
            </p>
            <span>
               <BiChevronRight />
            </span>
            <p className='hover:blue-5 hover:underline'>
               <LocalizedLink href='/reports'>Report Store</LocalizedLink>
            </p>
            <span>
               <BiChevronRight />
            </span>
            <p className='hover:blue-5 hover:underline'>
               <LocalizedLink
                  href={`/reports/?industries=${reportData.industry.slug}`}
               >
                  {reportData.industry.name}
               </LocalizedLink>
            </p>
         </div>
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
                                 selectedIndex === index
                                    ? 'border-y border-s-300 bg-blue-2 font-semibold text-white'
                                    : ''
                              }`}
                              onClick={() => {
                                 setSelectedIndex(index);
                                 scrollIntoView(item.id);
                              }}
                           >
                              {item.title}
                           </li>
                        ))}
                  </ul>
               </div>
               <div className='w-full rounded-md border border-s-400 bg-white px-4 py-6 pt-4'>
                  <p className='text-center text-lg font-semibold'>
                     {reportData.rightSectionHeading}
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
                     {reportData.leftSectionPrimaryCTAButton.title?.replace(
                        'Purchase',
                        'Buy',
                     )}
                  </Button>
               </div>
               <LocalizedLink
                  href={getCTALink(
                     reportData.leftSectionSecondaryCTAButton.link,
                  )}
               >
                  <Button className='w-full py-3' variant='light'>
                     {reportData.leftSectionSecondaryCTAButton.title}
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
         <Popup name='report-enquiry' title='Report Enquiry'>
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
