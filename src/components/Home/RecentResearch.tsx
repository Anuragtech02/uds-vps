'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { getRecentReports } from '@/utils/cache-recent-reports.utils';
import { useEffect, useState } from 'react';

const RecentResearch: React.FC<{ data: any }> = ({ data }) => {
   const [reports, setReports] = useState<any>([]);

   useEffect(() => {
      let reportsData = getRecentReports();
      setReports(reportsData);
   }, []);

   const recentResearchSection = {
      recentResearchSectionTitle:
         data?.data?.attributes?.recentResearchSectionTitle ||
         'Recently Viewed Reports',
      recentResearchSectionReportsCount: reports?.length || 0,
   };
   if (reports?.length < 1) return null;

   function getYear(report: {
      publishedAt: string;
      oldPublishedAt: string | null;
   }) {
      if (report.oldPublishedAt && new Date(report.oldPublishedAt)) {
         return new Date(report.oldPublishedAt).getFullYear().toString();
      }

      return new Date(report.publishedAt).getFullYear().toString();
   }

   return (
      <section className='min-h-full pb-0 pt-10 md:pt-8'>
         <div className='container'>
            <h2
               dangerouslySetInnerHTML={{
                  __html: recentResearchSection.recentResearchSectionTitle,
               }}
            />
            <div className='my-8 md:my-10 md:mb-0'>
               <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                  {reports?.map((report: any, index: number) => {
                     return (
                        <div key={index}>
                           <ResearchCard
                              key={index}
                              type='latest'
                              title={report?.title}
                              slug={report?.slug}
                              year={getYear(report)}
                              image={
                                 report?.highlightImage?.data?.attributes ||
                                 sampleImage
                              }
                              date={new Date(
                                 report?.oldPublishedAt || report?.publishedAt,
                              ).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric',
                              })}
                           />
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default RecentResearch;
