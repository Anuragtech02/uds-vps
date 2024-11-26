'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { FaArrowRightLong } from 'react-icons/fa6';
// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';
import PreBookCTA from '../commons/PreBookCTA';
import { getRecentReports } from '@/utils/cache-recent-reports.utils';
import { useEffect, useState } from 'react';

const RecentResearch: React.FC<{ data: any }> = ({ data }) => {
   const [reports, setReports] = useState<any>([]);
   const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5.2,
      arrows: false,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 3.2,
               slidesToScroll: 3,
               infinite: true,
               dots: false,
            },
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2.2,
               slidesToScroll: 2,
            },
         },
         {
            breakpoint: 480,
            settings: {
               slidesToShow: 1.2,
               slidesToScroll: 1,
            },
         },
      ],
   };

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
   return (
      <section className='min-h-full pt-10 md:pt-20'>
         <div className='container'>
            <h2
               dangerouslySetInnerHTML={{
                  __html: recentResearchSection.recentResearchSectionTitle,
               }}
            />
            <div className='my-8 md:my-10'>
               <div className='grid grid-cols-2 md:grid-cols-5'>
                  {reports?.map((data: any, index: number) => {
                     return (
                        <div key={index} className='pr-4'>
                           <ResearchCard
                              key={index}
                              type='latest'
                              title={data?.title}
                              slug={data?.slug}
                              year={data?.year}
                              image={data?.image || sampleImage}
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
