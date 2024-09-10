'use client';
import { useEffect, useState } from 'react';
import Button from '../commons/Button';
import sampleReport from './sample.json';
import ReportBlockData from './ReportBlockData';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
// import fetchClientMedusa from '@/utils/api/config-medusa';

const reportIndex = [
   { title: 'About this report', id: 'about-report' },
   { title: 'Table of content', id: 'table-of-content' },
   { title: 'Report Data', id: 'report-data' },
];

const licenseOptions = [
   {
      title: 'Single User License',
      discountedPrice: '$4,200',
      price: '$5,000',
      perks: [
         'Electronic copy of the report',
         'Unlimited access to the report',
         'Free quarterly updates',
         'Free report customization',
      ],
   },
   {
      title: 'Site License',
      discountedPrice: '$6,800',
      price: '$8,000',
      perks: [
         'Electronic copy of the report',
         'Unlimited access to the report',
         'Free quarterly updates',
         'Free report customization',
         'Allows up to ten individuals to access the report',
      ],
      description: 'Allows up to five individuals to access the report',
   },
   {
      title: 'Global License',
      discountedPrice: '$9,350',
      price: '$11,000',
      perks: [
         'Electronic copy of the report',
         'Unlimited access to the report',
         'Free quarterly updates',
         'Free report customization',
         'Allows the report to be shared across all employees',
      ],

      description: 'Allows the report to be shared across all employees',
   },
];

const ReportBlock: React.FC<{ data: any }> = ({ data }) => {
   const reportData = {
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
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [selectedLicense, setSelectedLicense] = useState(0);
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
            block: 'start',
            inline: 'nearest',
         });
      }
   }

   return (
      <div className='container py-10 md:py-16'>
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
            <div className='sticky top-[280px] hidden flex-[0.2] flex-col gap-6 lg:flex'>
               <div className='w-full rounded-md border border-s-400 bg-white'>
                  <ul className='list-none p-0'>
                     {reportIndex.map((item, index) => (
                        <li
                           key={index}
                           className={`cursor-pointer px-4 py-3 transition-all duration-150 ${selectedIndex === index && 'border-y border-s-300 bg-blue-2 font-semibold text-white'} `}
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
               <div className='relative mt-4'>
                  <div className='width-[max-content] absolute -top-4 left-0 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white'>
                     Upto 20% off
                  </div>
                  <Link href={reportData.leftSectionPrimaryCTAButton.link}>
                     <Button className='w-full py-3' variant='secondary'>
                        {reportData.leftSectionPrimaryCTAButton.title}
                     </Button>
                  </Link>
               </div>
               <Link href={reportData.leftSectionSecondaryCTAButton.link}>
                  <Button className='w-full py-3' variant='light'>
                     {reportData.leftSectionSecondaryCTAButton.title}
                  </Button>
               </Link>
            </div>
            <div className='flex-[0.6]'>
               <ReportBlockData data={reportData} />
            </div>
            <div className='sticky top-[280px] flex w-full flex-col gap-6 lg:w-max lg:flex-[0.2]'>
               <div className='w-full rounded-md border border-s-400 bg-white px-4 py-6'>
                  <p className='capitalise text-center text-lg font-semibold'>
                     {reportData.rightSectionHeading}
                  </p>
                  <div className='mt-4 flex flex-col gap-2'>
                     {/* {medusaReport?.variants?.map((license: any, index: number) => (
                        <div
                           key={index}
                           className={`cursor-pointer rounded-md border border-s-300 p-4 transition-all duration-150 ${
                              selectedLicense === index && 'border-blue-2'
                           }`}
                           onClick={() => setSelectedLicense(index)}
                        >
                           <div className='flex items-center justify-between gap-3'>
                              <div className='flex items-start gap-2'>
                                 <input
                                    type='radio'
                                    className='mt-1'
                                    checked={selectedLicense === index}
                                 />
                                 <p className='w-2/3 font-semibold'>
                                    {license.options[0].value}
                                 </p>
                              </div>
                              <div className='shrink-0'>
                                 <p className='text-[0.625rem] text-sm line-through'>
                                    {license.prices[0].amount}
                                 </p>
                                 <p className='font-semibold text-green-1'>
                                    {license.prices[0].amount}
                                 </p>
                              </div>
                           </div>

                           <ul
                              className={`list-disc pl-4 transition-all duration-150 ${selectedLicense === index ? 'mt-4 h-auto overflow-visible' : 'h-0 overflow-hidden'} `}
                           >
                              {license.metadata?.description?.split(",")?.map((perk, index) => (
                                 <li
                                    key={index}
                                    className='py-1 text-sm text-s-800'
                                 >
                                    {perk}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))} */}
                  </div>
               </div>
               <Button className='w-full py-3' variant='secondary'>
                  Buy Now
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ReportBlock;
