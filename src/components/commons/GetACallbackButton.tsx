'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LocalizedLink } from './LocalizedLink';
import Button from './Button';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';

const GetACallbackButton = () => {
   const pathname = usePathname();
   const { locale } = useLocale();
   return (
      <LocalizedLink
         href={`${pathname?.replace(`/${locale}`, '')}?popup=demo-request`}
         lang={locale}
      >
         <Button
            variant='light'
            className='border border-blue-9 !bg-blue-1 text-blue-9'
         >
            {TRANSLATED_VALUES[locale]?.footer?.['Send An Enquiry']} →
         </Button>
      </LocalizedLink>
   );
};

export default GetACallbackButton;
