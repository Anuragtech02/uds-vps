'use client';

import React, { useState } from 'react';
import AdvancedSearch from './AdvancedSearch';
import { useSearchStore } from '@/stores/search.store';

const SearchWrapper = () => {
   const searchStore = useSearchStore();
   const closeSearch = () => searchStore?.toggleGlobalSearch();

   return (
      <AdvancedSearch
         isOpen={searchStore?.isGlobalSearchVisible}
         onClose={closeSearch}
      />
   );
};

export default SearchWrapper;
