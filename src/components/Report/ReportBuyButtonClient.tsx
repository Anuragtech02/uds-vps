'use client';
import React from 'react';
import Button from '../commons/Button';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import { License } from '@/utils/cart-utils.util';
import { useRouter } from 'next/navigation';

interface Props {
   variants: License[];
}

const ReportBuyButtonClient: React.FC<Props> = ({ variants }) => {
   const selectedLicenses = useSelectedLicenseStore();
   const router = useRouter();

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
   );
};

export default ReportBuyButtonClient;
