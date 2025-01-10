import React, { useState } from 'react';

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
   selectedLicense: number | null;
   setSelectedLicense: (index: number | null) => void;
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

const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
   return Math.round(price * (1 - discountPercentage / 100));
};

const CollapsibleLicenseOptions: React.FC<CollapsibleLicenseOptionsProps> = ({
   variants,
   selectedLicense,
   setSelectedLicense,
}) => {
   const toggleLicense = (index: number) => {
      setSelectedLicense(selectedLicense === index ? null : index);
   };

   return (
      <div className='mt-3 flex flex-col gap-2'>
         {variants?.map((license: License, index: number) => {
            const discountPercentage = getDiscountPercentage(index);
            const discountedPrice = calculateDiscountedPrice(license.price.amount, discountPercentage);

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
                           />
                           <div>
                              <label
                                 htmlFor={`license-${index}`}
                                 className='block text-base font-semibold'
                              >
                                 {license.title}
                              </label>
                           </div>
                        </div>
                        <div className='flex flex-col items-end'>
                           <p className='text-sm text-gray-500 line-through'>
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
                  {selectedLicense === index && (
                     <div
                        dangerouslySetInnerHTML={{
                           __html: license?.description,
                        }}
                        className='report-content border-t border-s-200 bg-gray-50 px-4 py-3 text-sm [&>p]:mb-0 [&>ul]:!list-disc [&>ul>li]:!mb-0'
                     ></div>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default CollapsibleLicenseOptions;