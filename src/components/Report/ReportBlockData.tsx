import { useEffect, useState } from 'react';
import reportData from './sample.json';
import TableOfContentItem from './TableOfContentItem';

const styles = {
   title: 'text-2xl font-semibold text-blue-2 mb-3',
   subTitle: 'text-lg font-semibold text-blue-2 mb-2 mt-4',
};

const ReportBlockData: React.FC<{ data: any }> = ({ data }) => {
   const [rmData, setRmData] = useState(data.researchMethodology);

   function processAndRemoveH2FromRM() {
      // <h2 style="pointer-events: auto;">Research Methodology</h2>
      const rmData = data.researchMethodology;
      // prase DOM and remove H2 having text 'Research Methodology'
      const parser = new DOMParser();
      const doc = parser.parseFromString(rmData, 'text/html');
      const h2 = doc.querySelector('h2');
      if (h2 && h2.textContent === 'Research Methodology') {
         h2.remove();
      }

      // also remove element with class price-breakup
      const priceBreakup = doc.querySelector('.price-breakup');
      if (priceBreakup) {
         priceBreakup.remove();
      }

      return doc.body.innerHTML;
   }

   function processReportData() {
      // remove all paragraph tags that only have a line break
      // <p><br>&nbsp;</p>
      const reportDataEl = document.getElementById('report-data');

      if (reportDataEl) {
         const pTags = reportDataEl.querySelectorAll('p');
         console.log({ pTags });
         pTags.forEach((pTag) => {
            // <p><br>&nbsp;</p>
            console.log(pTag.innerHTML);
            if (
               pTag.innerHTML === '<br>&nbsp;' ||
               pTag.innerHTML === '<br>' ||
               pTag.innerHTML === '<br> ' ||
               pTag.innerHTML === '<br> &nbsp;' ||
               pTag.innerHTML === '&nbsp;' ||
               pTag.innerHTML === '<br><br>&nbsp;'
            ) {
               console.log('first');
               // document.getElementById('report-data')?.removeChild(pTag);
            }
         });
      }
   }

   useEffect(() => {
      setRmData(processAndRemoveH2FromRM());
      processReportData();
   }, []);

   return (
      <div className='space-y-6 text-s-700 md:px-4'>
         {/* <div
            id='about-report'
            dangerouslySetInnerHTML={{
               __html: data.aboutReport,
            }}
            className='report-content -mt-10'
         ></div> */}

         <div
            id='report-data'
            className='report-content'
            dangerouslySetInnerHTML={{
               __html: data.description,
            }}
         ></div>
         <div>
            <div>
               <h2 className={styles.title}>Table of Contents</h2>
            </div>
            <ol id='table-of-content'>
               {data.tableOfContent.map((section: any, index: number) => (
                  <TableOfContentItem
                     {...section}
                     number={index + 1}
                     key={index}
                  />
               ))}
            </ol>
         </div>

         <div>
            {/* <div>
               <h2 className={styles.title}>Research Methodology</h2>
            </div> */}
            <div
               id='research-methodology'
               className='report-content -mt-10'
               dangerouslySetInnerHTML={{
                  __html: rmData,
               }}
            ></div>
         </div>

         {/* <div className='space-y-4'>
            <div>
               <h2 className={styles.title}>Expert Analysis</h2>
               <p>{reportData.expertAnalysis.description}</p>
            </div>
            <div className='flex items-start space-x-4 bg-white p-4'>
               <img
                  src='https://randomuser.me/api/portraits/men/1.jpg'
                  alt={reportData.expertAnalysis.analyst.name}
                  className='h-16 w-16 rounded-full'
               />
               <div>
                  <p className={styles.subTitle}>
                     {reportData.expertAnalysis.analyst.name}
                  </p>
                  <p className='text-sm text-gray-600'>
                     {reportData.expertAnalysis.analyst.position}
                  </p>
                  <p className='mt-2 italic'>
                     &quot;{reportData.expertAnalysis.analyst.quote}&quot;
                  </p>
               </div>
            </div>
         </div> */}

         {/* <div>
            <div>
               <h2 className={styles.title}>More About this Report</h2>
            </div>
            <div>
               <p>
                  For the purposes of this report, the following segments are
                  included in the product category:
               </p>
               <ul className='mt-2 list-disc pl-5'>
                  {reportData.reportSegments.map((segment, index) => (
                     <li key={index}>{segment}</li>
                  ))}
               </ul>
               <p className='mt-4'>
                  This report contains market share and sales for leading
                  brands, including:
               </p>
               <ul className='mt-2 list-disc pl-5'>
                  {reportData.includedBrands.map((brand, index) => (
                     <li key={index}>{brand}</li>
                  ))}
               </ul>
            </div>
         </div> */}
      </div>
   );
};

export default ReportBlockData;
