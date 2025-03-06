// InteractiveTOC.client.tsx
'use client';

import { useState } from 'react';
import TableOfContentItem from './TableOfContentItem';

interface InteractiveTOCProps {
   tableOfContent: any[];
}

export default function InteractiveTOC({
   tableOfContent,
}: InteractiveTOCProps) {
   const [expandedSections, setExpandedSections] = useState<Set<number>>(
      new Set(),
   );

   const toggleSection = (index: number) => {
      setExpandedSections((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(index)) {
            newSet.delete(index);
         } else {
            newSet.add(index);
         }
         return newSet;
      });
   };

   const expandAll = () => {
      const allIndices = new Set(tableOfContent.map((_, index) => index));
      setExpandedSections(allIndices);
   };

   const collapseAll = () => {
      setExpandedSections(new Set());
   };

   return (
      <>
         <div className='-mt-6 mb-4 flex w-full items-center justify-start'>
            <button
               onClick={() => {
                  if (expandedSections.size === tableOfContent.length) {
                     collapseAll();
                  } else {
                     expandAll();
                  }
               }}
               className='ml-auto font-medium text-blue-1 hover:text-blue-2 hover:underline'
               type='button'
            >
               {expandedSections.size === tableOfContent.length
                  ? 'Collapse All'
                  : 'Expand All'}
            </button>
         </div>
         <ol id='table-of-content'>
            {tableOfContent.map((section, index) => (
               <TableOfContentItem
                  key={index}
                  {...section}
                  number={index + 1}
                  isExpanded={expandedSections.has(index)}
                  onToggle={() => toggleSection(index)}
               />
            ))}
         </ol>
      </>
   );
}
