'use client'

import { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useSearchStore } from '@/stores/search.store';

const ClientSearchHero: React.FC<{
  placeholder?: string;
  variant?: 'light' | 'dark';
}> = ({
  placeholder = "Search for reports, blogs, news articles, industries, or geographies...",
  variant = 'dark',
 }) => {
  const searchStore = useSearchStore();

  const handleSearchClick = () => {
    searchStore?.toggleGlobalSearch();
  };

  const inputClasses = variant === 'light' 
    ? 'text-white border-gray-300'
    : 'text-border-blue-2 border-blue-2';

  return (
    <div className={`mt-6 flex items-center gap-2 rounded-xl border px-3 py-2 md:w-2/3 ${inputClasses}`}>
      <span className='text-2xl'>
        <IoIosSearch />
      </span>
      <input
        onClick={handleSearchClick}
        type='text'
        placeholder={placeholder}
        className='w-full bg-transparent text-[1.125rem] outline-none'
      />
    </div>
  );
};

export default ClientSearchHero;