'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { FaArrowRightLong } from 'react-icons/fa6';
// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';
import PreBookCTA from '../commons/PreBookCTA';
import { SLICK_COMMON_SETTINGS } from '@/utils/constants';


const LatestResearch: React.FC<{ data: any; reports: any, upcomingReports: any }> = ({
   data,
   reports,
   upcomingReports,
}) => {
   const settings = SLICK_COMMON_SETTINGS;

   const latestResearchSection = {
      latestResearchSectionTitle:
         data?.data?.attributes?.latestResearchSectionTitle,
      latestResearchSectionReportsCount:
         data.data.attributes.latestResearchSectionReportsCount,
      latestResearchSectionCTABanner: {
         title: data.data.attributes.latestResearchSectionCTABanner.title,
         type: data.data.attributes.latestResearchSectionCTABanner.type,
         ctaButton:
            data.data.attributes.latestResearchSectionCTABanner.ctaButton,
      },
   };

   function getYear(report: {
      publishedAt: string;
      oldPublishedAt: string | null;
   }){
      if(report.oldPublishedAt && new Date(report.oldPublishedAt)){
         return new Date(report.oldPublishedAt).getFullYear().toString();
      }

      return new Date(report.publishedAt).getFullYear().toString();
   }

   return (
      <section className='min-h-full py-4 md:py-8 !pt-2'>
         <div className='container'>
            <h2
               dangerouslySetInnerHTML={{
                  __html: latestResearchSection.latestResearchSectionTitle,
               }}
            />
            <div className='my-8 md:my-10'>
               <Slider {...settings}>
                  {reports.map((report: any, index: number) => (
                      <div key={index} className='pr-4'>
                        <ResearchCard
                           key={index}
                           type='latest'
                           title={report?.title}
                           slug={report?.slug}
                           year={getYear(report)}
                           image={report?.highlightImage?.data?.attributes?.formats?.small?.url || sampleImage}
                           date={new Date(report?.oldPublishedAt || report?.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        />
                      </div>
                  ))}
               </Slider>
            </div>
            {upcomingReports?.length > 0 && (
               <>
                  <div className='h-8'></div>
                  <PreBookCTA
                     title={
                        latestResearchSection.latestResearchSectionCTABanner.title
                     }
                     ctaButton={
                        latestResearchSection.latestResearchSectionCTABanner.ctaButton
                     }
                  />
               </>
            )}
         </div>
      </section>
   );
};

export default LatestResearch;
