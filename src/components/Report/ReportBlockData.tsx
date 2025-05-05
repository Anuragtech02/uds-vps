'use client';
import { useEffect, useState } from 'react';
import TableOfContentItem from './TableOfContentItem';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';

interface ReportBlockDataProps {
   data: any;
}

const ReportBlockData: React.FC<ReportBlockDataProps> = ({ data }) => {
   const [expandedSections, setExpandedSections] = useState<Set<number>>(
      new Set(),
   );
   const [rmData, setRmData] = useState<string>(data.researchMethodology);

   const { locale } = useLocale();

   const toggleSection = (index: number): void => {
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

   const expandAll = (): void => {
      const allIndices = new Set(
         data.tableOfContent.map((_: any, index: number) => index),
      ) as Set<number>;
      setExpandedSections(allIndices);
   };

   const collapseAll = (): void => {
      setExpandedSections(new Set());
   };

   function processAndRemoveH2FromRM(): string {
      const rmData = data.researchMethodology;
      const parser = new DOMParser();
      const doc = parser.parseFromString(rmData, 'text/html');
      const h2 = doc.querySelector('h2');
      if (h2 && h2.textContent === 'Research Methodology') {
         h2.remove();
      }
      const priceBreakup = doc.querySelector('.price-breakup');
      if (priceBreakup) {
         priceBreakup.remove();
      }
      return doc.body.innerHTML;
   }

   useEffect(() => {
      setRmData(processAndRemoveH2FromRM());
   }, []);

   return (
      <div className='space-y-6 text-s-700 md:px-4'>
         <div
            id='report-data'
            className='report-content section-anchor'
            dangerouslySetInnerHTML={{
               __html: data.description,
            }}
         />

         <div className='section-anchor'>
            <div className='mb-4 flex items-center justify-between'>
               <h2 className='text-2xl font-semibold text-blue-2'>
                  {TRANSLATED_VALUES[locale]?.report?.tableOfContent}
               </h2>
               <div className='space-x-4'>
                  <button
                     onClick={() => {
                        if (
                           expandedSections.size === data.tableOfContent.length
                        ) {
                           collapseAll();
                        } else {
                           expandAll();
                        }
                     }}
                     className='font-medium text-blue-1 hover:text-blue-2'
                     type='button'
                  >
                     {expandedSections.size === data.tableOfContent.length
                        ? TRANSLATED_VALUES[locale]?.report?.collapseAll
                        : TRANSLATED_VALUES[locale]?.report?.expandAll}
                  </button>
               </div>
            </div>
            <ol id='table-of-content'>
               {data.tableOfContent.map((section: any, index: number) => (
                  <TableOfContentItem
                     {...section}
                     number={index + 1}
                     key={index}
                     isExpanded={expandedSections.has(index)}
                     onToggle={() => toggleSection(index)}
                  />
               ))}
            </ol>
         </div>

         <div
            id='research-methodology'
            className='report-content section-anchor !pt-12'
            dangerouslySetInnerHTML={{
               __html: rmData,
            }}
         />
      </div>
   );
};

export default ReportBlockData;
