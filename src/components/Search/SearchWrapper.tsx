'use client';

import React, { useState } from 'react';
import AdvancedSearch from './AdvancedSearch';

const SearchWrapper = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(true);

  const closeSearch = () => setIsSearchOpen(false);

  return (
      <AdvancedSearch isOpen={isSearchOpen} onClose={closeSearch} />
  );
};

export default SearchWrapper;