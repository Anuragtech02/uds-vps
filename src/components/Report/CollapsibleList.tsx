'use client';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import {
   getLicenseOfReport,
   setLicenseOfReport,
} from '@/utils/cart-utils.util';
import React, { useEffect, useState } from 'react';

interface License {
   title: string;
   price: {
      amount: number;
      currency: string;
   };
   description: string;
}

interface CollapsibleLicenseOptionsProps {
   variants: License[];
   reportData: {
      id: number;
   };
}

const formatCurrency = (amount: number, currency: string) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(amount);
};

const getDiscountPercentage = (index: number): number => {
   switch (index) {
      case 0: // Single license
         return 10;
      case 1: // Site license
         return 20;
      case 2: // Global license
         return 30;
      default:
         return 0;
   }
};

const calculateDiscountedPrice = (
   price: number,
   discountPercentage: number,
): number => {
   return Math.round(price * (1 - discountPercentage / 100));
};

const CollapsibleLicenseOptions: React.FC<CollapsibleLicenseOptionsProps> = ({
   variants,
   reportData,
}) => {
   const [expandedLicense, setExpandedLicense] = useState<number | null>(null);
   const [selectedLicense, setSelectedLicense] = useState<number | null>(null);
   const selectedLicenses = useSelectedLicenseStore();

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

   const toggleLicense = (index: number) => {
      // If clicking the same license that's already selected and expanded
      if (selectedLicense === index && expandedLicense === index) {
         setExpandedLicense(null); // Close the expansion
      } else {
         setSelectedLicense(index); // Select the license
         setExpandedLicense(index); // Expand the license
      }
   };
   return (
      <div className='mt-3 flex flex-col gap-2'>
         {variants?.map((license: License, index: number) => {
            const discountPercentage = getDiscountPercentage(index);
            const discountedPrice = calculateDiscountedPrice(
               license.price.amount,
               discountPercentage,
            );

            return (
               <div
                  key={index}
                  className={`rounded-md border border-s-300 transition-all duration-150 ${
                     selectedLicense === index ? 'border-blue-2' : ''
                  }`}
               >
                  <div
                     className='cursor-pointer px-4 py-3'
                     onClick={() => toggleLicense(index)}
                  >
                     <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                           <input
                              type='radio'
                              className='mt-1.5'
                              checked={selectedLicense === index}
                              onChange={() => toggleLicense(index)}
                              id={`license-${index}`}
                              aria-label={`Select ${license.title}`}
                           />
                           <label
                              className='block cursor-pointer text-sm font-semibold'
                              onClick={(e) => {
                                 e.preventDefault();
                                 toggleLicense(index);
                              }}
                           >
                              {license.title}
                           </label>
                        </div>
                        <div className='flex flex-col items-end'>
                           <p className='text-sm text-red-500 line-through'>
                              {formatCurrency(
                                 license.price.amount,
                                 license.price.currency,
                              )}
                           </p>
                           <div className='flex items-center gap-1'>
                              <span className='text-md font-semibold text-green-1'>
                                 {formatCurrency(
                                    discountedPrice,
                                    license.price.currency,
                                 )}
                              </span>
                              <span className='text-sm text-green-700'>
                                 (-{discountPercentage}%)
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                  {expandedLicense === index && (
                     <div
                        dangerouslySetInnerHTML={{
                           __html: license?.description,
                        }}
                        className='report-content border-t border-s-200 bg-gray-50 px-4 py-3 text-sm [&>p]:mb-0 [&>ul>li]:!mb-0 [&>ul]:!list-disc'
                     ></div>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default CollapsibleLicenseOptions;
