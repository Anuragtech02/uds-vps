'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { FaArrowRightLong } from 'react-icons/fa6';
// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';
import PreBookCTA from '../commons/PreBookCTA';


const LatestResearch: React.FC<{ data: any; reports: any, upcomingReports: any }> = ({
   data,
   reports,
   upcomingReports,
}) => {
      const settings = {
         dots: false,
         infinite: true,
         slidesToShow: 4.2,
         slidesToScroll: 1,
         arrows: false,
         dynamicHeight: false,
         autoplay: true,
         autoplaySpeed: 3000,
         ease: 'linear',
         responsive: [
            {
               breakpoint: 1200,
               settings: {
                  slidesToShow: 3.2,
                  // slidesToScroll: 1,
                  infinite: true,
                  dots: false,
               },
            },
            {
               breakpoint: 1024,
               settings: {
                  slidesToShow: 3.2,
                  // slidesToScroll: 1,
                  infinite: true,
                  dots: false,
               },
            },
            {
               breakpoint: 786,
               settings: {
                  slidesToShow: 2,
                  // slidesToScroll: 2,
               },
            },
            {
               breakpoint: 600,
               settings: {
                  slidesToShow: 2,
                  // slidesToScroll: 2,
               },
            },
            {
               breakpoint: 480,
               settings: {
                  slidesToShow: 1,
                  // slidesToScroll: 1,
               },
            },
         ],
   };

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
      <section className='min-h-full py-10 md:py-20'>
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
