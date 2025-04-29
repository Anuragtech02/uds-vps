import Button from '../commons/Button';
import ReportBlockData from './ReportBlockData';
import CollapsibleLicenseOptions from './CollapsibleList';
import Popup from '../Popup';
import { getCTALink } from '@/utils/generic-methods';
import ReportFAQs from './ReportFAQs';
import { LocalizedLink } from '../commons/LocalizedLink';
import Breadcrumbs from './Breadcrumbs';
import dynamic from 'next/dynamic';
import SidebarSectionIndexClient from './SidebarSectionIndexClient';
import ReportBuyButtonClient from './ReportBuyButtonClient';
import ReportBlockDataServer from './ReportBlockDataServer';
import { DEFAULT_VARIANTS } from '@/utils/constants';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import React from 'react';

const ReportEnquiryForm = dynamic(() => import('./ReportEnquiryForm'), {
   loading: () => (
      <div className='flex min-h-[400px] w-full items-center justify-center bg-gray-50'>
         <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-2 border-t-transparent'></div>
      </div>
   ),
});

const SampleReportDownloadForm = dynamic(
   () => import('./SampleReportDownloadForm'),
   {
      loading: () => (
         <div className='flex min-h-[400px] w-full items-center justify-center bg-gray-50'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-2 border-t-transparent'></div>
         </div>
      ),
   },
);

const MobileReportBlock = dynamic(() => import('./MobileReportIndex'), {
   loading: () => (
      <div className='flex min-h-[400px] w-full items-center justify-center bg-gray-50'>
         <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-2 border-t-transparent'></div>
      </div>
   ),
});

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
   locale?: string;
}

const reportIndex = [
   // { title: 'About this report', id: 'about-report' },
   { title: 'Report Description', id: 'report-data' },
   { title: 'Table of content', id: 'table-of-content' },
   { title: 'Research Methodology', id: 'research-methodology' },
   { title: 'FAQs', id: 'faq-section' },
];

const ReportBlock: React.FC<ReportBlockProps> = ({ data, locale = 'en' }) => {
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

   let variants: Variant[] = data.attributes.variants.map((variant, i) => ({
      title: variant.title,
      description: variant.description,
      price: {
         amount: variant?.price?.amount || DEFAULT_VARIANTS[i].price.amount,
         currency:
            variant.price?.currency || DEFAULT_VARIANTS[i].price.currency,
      },
   }));

   if (variants.length === 0) {
      variants = DEFAULT_VARIANTS;
   }

   return (
      <div className='container py-10 md:py-16 md:pt-10'>
         <Breadcrumbs
            industry={{
               name: reportData.industry.name,
               slug: reportData.industry.slug,
            }}
            locale={locale}
         />
         <div className='flex flex-col items-start gap-4 lg:flex-row'>
            <div className='sticky top-28 hidden w-1/4 flex-col gap-6 lg:flex'>
               <SidebarSectionIndexClient
                  reportData={reportData}
                  locale={locale}
               />
               <div className='w-full rounded-md border border-s-400 bg-white px-4 py-6 pt-4'>
                  <p className='text-center text-lg font-semibold'>
                     {/* This is {reportData.rightSectionHeading} */}
                     {TRANSLATED_VALUES[locale].report.licenseOptions}
                  </p>
                  <CollapsibleLicenseOptions
                     variants={variants}
                     reportData={reportData}
                  />
               </div>
               <div className='relative mt-3'>
                  <ReportBuyButtonClient variants={variants} locale={locale} />
               </div>
               <LocalizedLink
                  // href={getCTALink(
                  //    reportData.leftSectionSecondaryCTAButton.link,
                  // )}
                  href={getCTALink('?popup=report-enquiry')}
               >
                  <Button className='w-full py-3' variant='light'>
                     {/* {reportData.leftSectionSecondaryCTAButton.title} */}
                     {TRANSLATED_VALUES[locale]?.report.requestForCustomization}
                  </Button>
               </LocalizedLink>
            </div>
            <div className='flex-1'>
               {/* <ReportBlockData data={reportData} /> */}
               <ReportBlockDataServer data={reportData} />
               {data?.attributes?.faqList?.length > 0 && (
                  <ReportFAQs data={data} />
               )}
            </div>
         </div>
         <MobileReportBlock
            reportIndex={reportIndex}
            variants={variants}
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
