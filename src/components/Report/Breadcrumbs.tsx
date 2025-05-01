import React from 'react';
import { LocalizedLink } from '../commons/LocalizedLink';
import { BiChevronRight } from 'react-icons/bi';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

interface Props {
   industry: {
      name: string;
      slug: string;
   };
   locale?: string;
}

const Breadcrumbs: React.FC<Props> = ({ industry, locale = 'en' }) => {
   return (
      <div className='flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-6 text-sm md:pb-10 md:text-lg'>
         <p className='hover:blue-5 min-w-fit hover:underline'>
            <LocalizedLink href='/' className='block truncate'>
               {TRANSLATED_VALUES[locale]?.header.home}
            </LocalizedLink>
         </p>
         <span className='flex-shrink-0 text-gray-500'>
            <BiChevronRight className='text-xl md:text-2xl' />
         </span>
         <p className='hover:blue-5 min-w-fit hover:underline'>
            <LocalizedLink href='/reports' className='block truncate'>
               {TRANSLATED_VALUES[locale]?.commons.reportStore}
            </LocalizedLink>
         </p>
         <span className='flex-shrink-0 text-gray-500'>
            <BiChevronRight className='text-xl md:text-2xl' />
         </span>
         <p className='hover:blue-5 min-w-fit max-w-[160px] hover:underline md:max-w-none'>
            <LocalizedLink
               href={`/reports/?industries=${industry.slug}`}
               className='block truncate'
            >
               {TRANSLATED_VALUES[locale]?.industries?.[industry.name]}
            </LocalizedLink>
         </p>
      </div>
   );
};

export default Breadcrumbs;
