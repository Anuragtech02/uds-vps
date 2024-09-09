'use client'

import { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useSearchStore } from '@/stores/search.store';

const ClientSearchHero: React.FC = ({ }) => {
  const searchStore = useSearchStore();

  const handleSearchClick = () => {
    searchStore?.toggleGlobalSearch();
  };
  return (
    <div className='mt-6 flex items-center gap-3 rounded-full border border-blue-2 px-6 py-3 md:w-2/3'>
      <span className='text-2xl'>
        <IoIosSearch />
      </span>
      <input
        onClick={handleSearchClick}
        type='text'
        placeholder="Search for reports, blogs, news articles, industries, or geographies..."
        className='w-full bg-transparent text-[1.125rem] outline-none'
      />
    </div>
  );
};

export default ClientSearchHero;