'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

interface SearchParams {
   industries?: string;
   geographies?: string;
   page?: string;
   viewType?: string;
}

interface PaginationProps {
   searchParams: SearchParams;
   currentPage: number;
   totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
   searchParams,
   currentPage,
   totalPages,
}) => {
   const router = useRouter();
   const pathname = usePathname();
   const { locale } = useLocale();

   const handlePageChange = (newPage: number) => {
      const params = new URLSearchParams({
         ...searchParams,
         page: newPage.toString(),
      });
      router.push(`${pathname}?${params.toString()}`);
   };

   if (totalPages <= 1) {
      return null;
   }

   return (
      <div className='my-6 flex items-center justify-center space-x-4'>
         <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Previous page'
         >
            <BiChevronLeft className='mr-1 h-5 w-5' />
            {TRANSLATED_VALUES[locale]?.commons.prev}
         </button>
         <span className='text-sm font-medium text-gray-700'>
            {TRANSLATED_VALUES[locale]?.commons.page}{' '}
            <span className='font-bold'>{currentPage}</span>{' '}
            {TRANSLATED_VALUES[locale]?.commons.of}{' '}
            <span className='font-bold'>{totalPages}</span>
         </span>
         <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Next page'
         >
            {TRANSLATED_VALUES[locale]?.commons.next}
            <BiChevronRight className='ml-1 h-5 w-5' />
         </button>
      </div>
   );
};

export default Pagination;
