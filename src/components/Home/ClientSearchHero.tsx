'use client';

import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useSearchStore } from '@/stores/search.store';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';

const ClientSearchHero: React.FC<{
   placeholder?: string;
   variant?: 'light' | 'dark';
   onlyIcon?: boolean;
}> = ({ placeholder = '', variant = 'dark', onlyIcon = false }) => {
   const searchStore = useSearchStore();

   const { locale } = useLocale();

   const placeholderText =
      TRANSLATED_VALUES[locale]?.header.searchPlaceholder || placeholder;

   const handleSearchClick = () => {
      searchStore?.toggleGlobalSearch();
   };

   const inputClasses =
      variant === 'light'
         ? 'bg-white text-gray-700 [&>input]:placeholder:text-gray-700'
         : 'text-border-blue-2 border-blue-2';

   return onlyIcon ? (
      <div
         className='flex cursor-pointer items-center gap-2 rounded-md bg-white p-2'
         onClick={handleSearchClick}
      >
         <span className='text-2xl'>
            <IoIosSearch />
         </span>
      </div>
   ) : (
      <div
         className={`mt-6 flex items-center gap-2 rounded-xl border px-3 py-2 md:w-2/3 ${inputClasses}`}
      >
         <span className='text-2xl'>
            <IoIosSearch />
         </span>
         <input
            onClick={handleSearchClick}
            type='text'
            placeholder={placeholderText}
            className='w-full bg-transparent text-[1.125rem] outline-none'
         />
      </div>
   );
};

export default ClientSearchHero;
