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
   const decimalPlaces = (amount.toString().split('.')[1] || '').length;

   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
   }).format(amount);
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
         {variants?.map((license: License, index: number) => (
            <div
               key={index}
               className={`rounded-md border border-s-300 transition-all duration-150 ${
                  selectedLicense === index ? 'border-blue-2' : ''
               }`}
            >
               <div
                  className='cursor-pointer px-4 py-2'
                  onClick={() => toggleLicense(index)}
               >
                  <div className='flex items-center justify-between gap-3'>
                     <div className='flex items-start gap-2'>
                        <div className='flex items-center gap-2'>
                           <input
                              type='radio'
                              className='mt-1'
                              checked={selectedLicense === index}
                              onChange={() => toggleLicense(index)}
                              id={`license-${index}`}
                           />
                           <label
                              htmlFor={`license-${index}`}
                              className='w-2/3 grow text-xs font-semibold md:text-sm'
                           >
                              {license.title}
                           </label>
                        </div>
                     </div>
                     <div className='flex shrink-0 items-center gap-2'>
                        <div>
                           {/* <p className='text-[0.625rem] text-sm line-through'>
                              {formatCurrency(
                                 license.price.amount,
                                 license.price.currency,
                              )}
                           </p> */}
                           <p className='text-sm font-semibold text-green-1'>
                              {formatCurrency(
                                 license.price.amount,
                                 license.price.currency,
                              )}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {selectedLicense === index && (
                  <div
                     dangerouslySetInnerHTML={{
                        __html: license?.description,
                     }}
                     className='report-content max-h-[100px] overflow-y-auto px-4 text-sm [&>p]:mb-0 [&>ul]:!list-disc'
                  ></div>
               )}
            </div>
         ))}
      </div>
   );
};

export default CollapsibleLicenseOptions;
