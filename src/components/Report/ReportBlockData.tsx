import reportData from './sample.json';
import TableOfContentItem from './TableOfContentItem';

const styles = {
   title: 'text-2xl font-semibold text-blue-2 mb-3',
   subTitle: 'text-lg font-semibold text-blue-2 mb-2 mt-4',
};

const ReportBlockData = () => {
   return (
      <div className='space-y-6 px-4 text-s-700'>
         <div>
            <div>
               <p className={styles.title}>Key Issues Covered in this Report</p>
            </div>
            <div>
               <ul className='list-disc space-y-2 pl-5'>
                  {reportData.keyIssuesCovered.map((issue, index) => (
                     <li key={index}>{issue}</li>
                  ))}
               </ul>
            </div>
         </div>

         <div>
            <div>
               <p className={styles.title}>Market Overview</p>
            </div>
            <div>
               <p className={styles.subTitle}>Current Landscape</p>
               <ul className='list-disc space-y-2 pl-5'>
                  {reportData.marketOverview.currentLandscape.map(
                     (point, index) => (
                        <li key={index}>{point}</li>
                     ),
                  )}
               </ul>
               <h3 className={styles.subTitle}>Market Growth</h3>
               <p>
                  The market increased by an estimated{' '}
                  {reportData.marketOverview.marketGrowth.estimatedGrowth} in{' '}
                  {reportData.marketOverview.marketGrowth.year}.
               </p>
            </div>
         </div>

         <div>
            <div>
               <h2 className={styles.title}>Table of Contents</h2>
            </div>
            <ol>
               {reportData.tableOfContents.map((section, index) => (
                  <TableOfContentItem
                     {...section}
                     number={index + 1}
                     key={index}
                  />
               ))}
            </ol>
         </div>

         <div className='space-y-4'>
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
         </div>

         <div>
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
         </div>
      </div>
   );
};

export default ReportBlockData;
