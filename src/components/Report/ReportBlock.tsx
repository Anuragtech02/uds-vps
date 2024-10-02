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
// import fetchClientMedusa from '@/utils/api/config-medusa';

const reportIndex = [
   { title: 'About this report', id: 'about-report' },
   { title: 'Report Data', id: 'report-data' },
   { title: 'Table of content', id: 'table-of-content' },
   { title: 'Research Methodology', id: 'research-methodology' },
];

const ReportBlock: React.FC<{ data: any }> = ({ data }) => {
   const reportData = {
      id: data.id,
      title: data.attributes.title,
      aboutReport: data.attributes.aboutReport,
      tableOfContent: data.attributes.tableOfContent,
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
   const variants = data.attributes.variants.map((variant: any) => ({
      title: variant.title,
      description: variant.description,
      price: {
         amount: variant.price.amount,
         currency: variant.price.currency,
      },
   }));

   const [selectedIndex, setSelectedIndex] = useState(0);
   const [selectedLicense, setSelectedLicense] = useState<number | null>(null);
   const [medusaReport, setMedusaReport] = useState({});

   // useEffect(() => {
   //    async function fetchProduct(){
   //       const res = await fetchClientMedusa(`/products/${data.attributes.medusaID}`);
   //       setMedusaReport(res.product);
   //    }
   //    fetchProduct();
   // }, []);

   function scrollIntoView(id: string) {
      // add 200px of top padding
      const element = document.getElementById(id);
      if (element) {
         element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
         });
      }
   }

   return (
      <div className='container py-10 md:py-16 md:pt-10'>
         <div className='flex items-center gap-2 pb-10 md:text-lg'>
            <Link href='/'>
               <p>Home</p>
            </Link>
            <span>
               <BiChevronRight />
            </span>
            <Link href='/report-store'>
               <p>Report Store</p>
            </Link>
            <span>
               <BiChevronRight />
            </span>

            <p>{reportData?.industry?.name}</p>
            <span>
               <BiChevronRight />
            </span>
            <p></p>
         </div>
         <div className='flex flex-col items-start gap-4 lg:flex-row'>
            <div className='sticky top-[100px] hidden flex-[0.23] flex-col gap-6 lg:flex'>
               <div className='w-full rounded-md border border-s-400 bg-white'>
                  <ul className='list-none p-0'>
                     {reportIndex.map((item, index) => (
                        <li
                           key={index}
                           className={`cursor-pointer px-4 py-2 transition-all duration-150 ${selectedIndex === index && 'border-y border-s-300 bg-blue-2 font-semibold text-white'} `}
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
                  <p className='capitalise text-center text-lg font-semibold'>
                     {reportData.rightSectionHeading}
                  </p>
                  <CollapsibleLicenseOptions
                     variants={variants}
                     selectedLicense={selectedLicense}
                     setSelectedLicense={setSelectedLicense}
                  />
               </div>

               <div className='relative mt-3'>
                  <div className='width-[max-content] absolute -top-4 left-0 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white'>
                     Upto 20% off
                  </div>
                  <Link
                     href={getCTALink(
                        reportData.leftSectionPrimaryCTAButton.link,
                     )}
                  >
                     <Button className='w-full py-3' variant='secondary'>
                        {reportData.leftSectionPrimaryCTAButton.title}
                     </Button>
                  </Link>
               </div>
               <Link
                  href={getCTALink(
                     reportData.leftSectionSecondaryCTAButton.link,
                  )}
               >
                  <Button className='w-full py-3' variant='light'>
                     {reportData.leftSectionSecondaryCTAButton.title}
                  </Button>
               </Link>
            </div>
            <div className='flex-[0.77]'>
               <ReportBlockData data={reportData} />
            </div>
         </div>
         <Popup name='report-enquiry' title='Report Enquiry'>
            <ReportEnquiryForm
               reportTitle={reportData?.title}
               reportId={reportData?.id}
            />
         </Popup>
         <Popup name='sample-report' title='Get Sample Report'>
            <SampleReportDownloadForm
               reportTitle={reportData?.title}
               reportId={reportData?.id}
            />
         </Popup>
      </div>
   );
};

export default ReportBlock;
