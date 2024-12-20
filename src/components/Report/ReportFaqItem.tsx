'use client';

import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';

const FAQItem = (data: { title: string; description: string }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div
         className='cursor-pointer rounded-md border border-s-200 bg-s-50 px-8 py-4'
         onClick={() => setIsOpen(!isOpen)}
      >
         <div className='flex w-full items-center justify-between'>
            <p className='text-lg font-semibold text-blue-1' dangerouslySetInnerHTML={{__html: data.title}}></p>
            {!isOpen ? (
               <BiChevronDown className='shrink-0 text-2xl text-blue-1' />
            ) : (
               <BiChevronDown className='shrink-0 rotate-180 transform text-2xl text-blue-1' />
            )}
         </div>
         <div
            className={`transition-all duration-200 ${isOpen ? 'h-auto overflow-visible py-4' : 'h-0 overflow-hidden'}`}
         >
            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
         </div>
      </div>
   );
};

export default FAQItem;
