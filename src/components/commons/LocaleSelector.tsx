'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_NAMES, SUPPORTED_LOCALES } from '@/utils/constants';

const LocaleSelector: React.FC<{
   theme?: 'light' | 'dark';
   size?: 'small' | 'large';
}> = ({ theme = 'dark', size = 'large' }) => {
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
      const queryParams = window.location.search;
      const segments = currentPath.split('/');

      // Remove existing language segment if present
      if (
         segments[1] &&
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
      const newPath = segments.join('/') + queryParams;
      router.push(newPath);
      router.refresh();

      // Set or remove RTL class on body based on locale
      if (newLocale === 'ar') {
         document.body.classList.add('rtl');
      } else {
         document.body.classList.remove('rtl');
      }

      setCurrentLocale(newLocale);
   };

   // Also handle RTL on initial load
   useEffect(() => {
      if (typeof window !== 'undefined') {
         if (currentLocale === 'ar') {
            document.body.classList.add('rtl');
         } else {
            document.body.classList.remove('rtl');
         }
      }
   }, [currentLocale]);

   return (
      <select
         name='locale'
         id='locale'
         aria-label='Select language'
         className={`cursor-pointer rounded-lg border ${
            theme === 'light'
               ? 'border-blue-1 text-blue-1 hover:bg-blue-1/10'
               : 'border-white text-white hover:bg-white/20'
         } bg-transparent ${
            size === 'small' ? 'px-1.5 py-0.5 pr-2 text-xs' : 'px-2 py-1 pr-8'
         } outline-none transition-colors`}
         onChange={handleLocaleChange}
         value={currentLocale}
      >
         {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
               {size === 'large'
                  ? LOCALE_NAMES.find((loc) => loc.locale === locale)?.title ||
                    locale
                  : locale.toUpperCase()}
            </option>
         ))}
      </select>
   );
};

export default LocaleSelector;
