import dynamic from 'next/dynamic';
import { DOMParser } from 'linkedom';

interface ReportBlockDataProps {
   data: any;
}

// Server-side HTML processing function
const processAndRemoveH2FromRM = (rmData: string): string => {
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
};

export default function ReportBlockData({ data }: ReportBlockDataProps) {
   const rmData = processAndRemoveH2FromRM(data.researchMethodology);

   // Dynamically import the interactive Table of Contents component as a client component
   const InteractiveTOC = dynamic(() => import('./InteractiveTOC'), {
      ssr: false,
   });

   return (
      <div className='space-y-6 text-s-700 md:px-4'>
         <div
            id='report-data'
            className='report-content section-anchor'
            dangerouslySetInnerHTML={{ __html: data.description }}
         />

         <div className='section-anchor'>
            <h2 className='text-2xl font-semibold text-blue-2'>
               Table of Contents
            </h2>
            <InteractiveTOC tableOfContent={data.tableOfContent} />
         </div>

         <div
            id='research-methodology'
            className='report-content section-anchor !pt-12'
            dangerouslySetInnerHTML={{ __html: rmData }}
         />
      </div>
   );
}
