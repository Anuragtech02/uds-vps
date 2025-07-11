import React from 'react';
import Button from './Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import reportIllustration from '@/assets/img/report.svg';
import { LocalizedLink } from './LocalizedLink';
import Image from 'next/image';

export interface ICTABanner {
   title: string;
   ctaButton: {
      title: string;
      link: string;
   };
}

const CustomResearchCTA = ({
   ctaBanner,
   locale = 'en',
}: {
   ctaBanner: ICTABanner;
   locale: string;
}) => {
   return (
      <div className='relative overflow-hidden rounded-xl border border-s-300 bg-gradient-to-r from-[rgba(128,189,255,0.3)] via-[rgba(94,197,230,0.3)] to-[rgba(60,204,204,0.3)] px-6 py-8 md:px-10'>
         <div className='text-center md:w-2/3 md:text-left'>
            <h2 dangerouslySetInnerHTML={{ __html: ctaBanner?.title }}></h2>
            <LocalizedLink href={'/contact-us'} lang={locale}>
               <Button
                  size='large'
                  variant='secondary'
                  className='mt-6'
                  icon={<FaArrowRightLong />}
               >
                  {ctaBanner?.ctaButton?.title}
               </Button>
            </LocalizedLink>
         </div>
         <Image
            src={reportIllustration.src}
            className='right-10 top-10 mx-auto mt-10 h-[300px] w-auto object-contain md:absolute md:mt-0'
            width={300}
            height={300}
            alt='report'
            unoptimized
         />
      </div>
   );
};

export default CustomResearchCTA;
