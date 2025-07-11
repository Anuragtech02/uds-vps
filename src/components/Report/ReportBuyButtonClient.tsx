'use client';
import Button from '../commons/Button';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import { addToCart, License } from '@/utils/cart-utils.util';
import { useRouter } from 'next/navigation';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { ReportData } from './ReportBlock';

interface Props {
   variants: License[];
   locale?: string;
   reportData: ReportData;
}

const ReportBuyButtonClient: React.FC<Props> = ({
   variants,
   locale = 'en',
   reportData,
}) => {
   const selectedLicenses = useSelectedLicenseStore();
   const router = useRouter();

   const handleBuyNow = () => {
      // @ts-ignore
      let selectedLicense = selectedLicenses.selectedLicenses[reportData.id];
      if (!selectedLicense) {
         // select single user by default
         selectedLicense = variants[0];
      }

      addToCart(
         // @ts-ignore
         { ...reportData, id: reportData.id, variants },
         selectedLicense,
      );
      router.push(locale === 'en' ? '/cart' : `/${locale}/cart`);
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
         {TRANSLATED_VALUES[locale]?.report.buyNow}
      </Button>
   );
};

export default ReportBuyButtonClient;
