'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';

// Global registry to track mounted popups
const popupRegistry = new Set<string>();

interface PopupProps {
   name: string;
   children: React.ReactNode;
   title: string;
   size?: 'md' | 'lg';
   onClose?: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
   const { name, title, children, onClose, size = 'md' } = props;
   const searchParams = useSearchParams();
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      // Check if this popup instance is already mounted
      if (popupRegistry.has(name)) {
         return;
      }

      setMounted(true);
      popupRegistry.add(name);

      return () => {
         popupRegistry.delete(name);
      };
   }, [name]);

   useEffect(() => {
      const popupValue = searchParams.get('popup');
      setIsOpen(popupValue === name);
   }, [searchParams, name]);

   const closePopup = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('popup');
      router.push(`?${params.toString()}`);
      setIsOpen(false);
      if (onClose) onClose();
   };

   // Only render if this is the mounted instance and it's open
   if (!mounted || !isOpen) return null;

   const popupContent = (
      <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50'>
         <div
            className={`m-4 w-full ${
               size === 'lg' ? 'max-w-2xl' : 'max-w-md'
            } rounded-lg bg-white p-6 shadow-lg`}
         >
            <div className='flex items-center justify-between'>
               <h3>{title}</h3>
               <button
                  title='Close'
                  onClick={closePopup}
                  className='text-gray-500 hover:text-gray-700'
               >
                  <svg
                     className='h-6 w-6'
                     fill='none'
                     viewBox='0 0 24 24'
                     stroke='currentColor'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                     />
                  </svg>
               </button>
            </div>
            {children}
         </div>
      </div>
   );

   // Use portal to render the popup at the document root
   return typeof window !== 'undefined'
      ? createPortal(popupContent, document.body)
      : null;
};

export default Popup;
