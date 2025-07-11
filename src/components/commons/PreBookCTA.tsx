import { FaArrowRightLong } from 'react-icons/fa6';
import Button from './Button';
import prebookBg from '@/assets/img/prebook-bg.png';
import Link from 'next/link';
import { LocalizedLink } from './LocalizedLink';
import Image from 'next/image';

const PreBookCTA: React.FC<{
   title: string;
   ctaButton: {
      link: string;
      title: string;
   };
   locale?: string;
}> = ({ title, ctaButton, locale = 'en' }) => {
   return (
      <div className='relative overflow-hidden rounded-xl bg-blue-1 p-8 py-12 text-white'>
         <Image
            src={prebookBg}
            fill
            unoptimized
            className='absolute inset-0 z-[1] h-full w-full object-cover object-center'
            alt=''
         />
         <div className='relative z-[2] mx-auto flex w-[95%] flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <h2
               className='text-white md:max-w-[60%] [&>span]:text-white'
               dangerouslySetInnerHTML={{
                  __html: title,
               }}
            ></h2>
            <LocalizedLink href={'/contact-us'} lang={locale}>
               <Button
                  size='large'
                  variant='light'
                  className='shrink-0 grow-0'
                  icon={<FaArrowRightLong />}
               >
                  {ctaButton?.title}
               </Button>
            </LocalizedLink>
         </div>
      </div>
   );
};

export default PreBookCTA;
