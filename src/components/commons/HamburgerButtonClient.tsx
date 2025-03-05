'use client';
import { useMenuStore } from '@/stores/menu.store';
import React from 'react';
import { BiMenu } from 'react-icons/bi';

const HamburgerButtonClient = () => {
   const { isMobileMenuOpen, setIsMobileMenuOpen } = useMenuStore();

   return (
      <button
         title='open'
         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
         className='text-white'
      >
         <BiMenu size={24} />
      </button>
   );
};

export default HamburgerButtonClient;
