'use client';

import { useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';

const TableOfContentItem = (data: {
   title: string;
   description: any;
   number: number;
}) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <li className='space-y-2'>
         <div
            className='flex cursor-pointer items-center justify-between bg-s-100 px-4 py-2'
            onClick={() => setIsOpen(!isOpen)}
         >
            <p className='text-lg font-semibold text-blue-1'>
               {data.number}. {data.title}
            </p>
            {!isOpen ? (
               <BiPlusCircle className='shrink-0 text-2xl text-blue-1' />
            ) : (
               <BiPlusCircle className='shrink-0 rotate-45 transform text-2xl text-blue-1' />
            )}
         </div>
         <div
            className={`${isOpen ? 'h-auto overflow-visible border-t border-s-300 py-4 pl-6' : 'h-0 overflow-hidden'}`}
         >
            {/* <ol className='list-decimal' start={1}>
               {data.subsections.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
               ))}
            </ol> */}
            <div
               dangerouslySetInnerHTML={{ __html: data.description }}
               className='pl-2 [&>ol]:list-decimal'
            ></div>
         </div>
      </li>
   );
};

export default TableOfContentItem;
