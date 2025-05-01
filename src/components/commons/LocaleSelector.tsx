'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_NAMES, SUPPORTED_LOCALES } from '@/utils/constants';

const LocaleSelector = () => {
   const router = useRouter();
   const [currentLocale, setCurrentLocale] = useState('en');

   useEffect(() => {
      // Get current locale from URL on client side
      if (typeof window !== 'undefined') {
         const pathSegments = window.location.pathname.split('/');
         const localeFromPath = pathSegments[1];

         // @ts-ignore
         if (localeFromPath && SUPPORTED_LOCALES.includes(localeFromPath)) {
            setCurrentLocale(localeFromPath);
         }
      }
   }, []);

   const handleLocaleChange = (e: any) => {
      const newLocale = e.target.value;
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/');

      // Remove existing language segment if present
      if (
         segments[1]?.length === 2 &&
         // @ts-ignore
         SUPPORTED_LOCALES.includes(segments[1])
      ) {
         segments.splice(1, 1);
      }

      // Insert new language segment only if it's not 'en'
      if (newLocale !== 'en') {
         segments.splice(1, 0, newLocale);
      }

      // Update the URL without full page reload
      const newPath = segments.join('/');
      router.push(newPath);

      // Refresh the current route to update all components
      router.refresh();

      setCurrentLocale(newLocale);
   };

   return (
      <select
         name='locale'
         id='locale'
         aria-label='Select language'
         className='cursor-pointer rounded-lg border border-white bg-transparent px-2 py-1 pr-8 text-white outline-none transition-colors hover:bg-white/20'
         onChange={handleLocaleChange}
         value={currentLocale}
      >
         {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
               {LOCALE_NAMES.find((loc) => loc.locale === locale)?.title ||
                  locale}
            </option>
         ))}
      </select>
   );
};

export default LocaleSelector;
