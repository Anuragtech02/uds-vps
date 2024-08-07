'use client';
import { useState } from 'react';
import Button from '../commons/Button';
import sampleReport from './sample.json';
import ReportBlockData from './ReportBlockData';

const reportIndex = [
   'About this report',
   'Table of contents',
   'List of figures',
   'List of tables',
   'Research methodology',
   'Request sample',
   'Request customization',
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

const ReportBlock = () => {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [selectedLicense, setSelectedLicense] = useState(0);

   return (
      <div className='container py-10 md:py-16'>
         <div className='flex items-start gap-4'>
            <div className='flex flex-[0.2] flex-col gap-6'>
               <div className='w-full rounded-md border border-s-400 bg-white'>
                  <ul className='list-none p-0'>
                     {reportIndex.map((item, index) => (
                        <li
                           key={index}
                           className={`cursor-pointer px-4 py-3 transition-all duration-150 ${selectedIndex === index && 'border-y border-s-300 bg-blue-2 font-semibold text-white'} `}
                           onClick={() => setSelectedIndex(index)}
                        >
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <Button className='w-full py-3' variant='secondary'>
                  Buy Now
               </Button>
               <Button className='w-full py-3' variant='light'>
                  Enquire Before Buying
               </Button>
            </div>
            <div className='flex-[0.6]'>
               <ReportBlockData />
            </div>
            <div className='flex flex-[0.2] flex-col gap-6'>
               <div className='w-full rounded-md border border-s-400 bg-white px-4 py-6'>
                  <p className='capitalise text-center text-lg font-semibold'>
                     Choose your License
                  </p>
                  <div className='mt-4 flex flex-col gap-2'>
                     {licenseOptions.map((license, index) => (
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
                                    {license.title}
                                 </p>
                              </div>
                              <div className='shrink-0'>
                                 <p className='text-[0.625rem] text-sm line-through'>
                                    {license.price}
                                 </p>
                                 <p className='font-semibold text-green-1'>
                                    {license.discountedPrice}
                                 </p>
                              </div>
                           </div>

                           <ul
                              className={`list-disc pl-4 transition-all duration-150 ${selectedLicense === index ? 'mt-4 h-auto overflow-visible' : 'h-0 overflow-hidden'} `}
                           >
                              {license.perks.map((perk, index) => (
                                 <li
                                    key={index}
                                    className='py-1 text-sm text-s-800'
                                 >
                                    {perk}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
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
