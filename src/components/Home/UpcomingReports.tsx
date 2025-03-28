'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';

// @ts-ignore
import Slider from 'react-slick';
import CustomResearchCTA from '../commons/CustomResearchCTA';
import { SLICK_COMMON_SETTINGS } from '@/utils/constants';

const UpcomingReports: React.FC<{ data: any }> = ({ data }) => {
   const settings = {
      ...SLICK_COMMON_SETTINGS,
      slidesToShow: 4,

      responsive: [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 4,
               // slidesToScroll: 1,
               infinite: true,
               dots: false,
            },
         },
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 3,
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
   return (
      data?.upcomingReports?.length > 0 && (
         <section className='block min-h-max pb-12 md:pb-20'>
            <div className='container'>
               <h2>
                  <span>Upcoming</span> reports
               </h2>

               <div className='my-8 md:my-16 md:mt-10'>
                  <Slider {...settings}>
                     {data?.upcomingReports?.map((data: any, index: number) => (
                        <div key={index} className='h-full pr-4'>
                           <ResearchCard
                              type='upcoming'
                              title={data.title}
                              slug={data.slug}
                              year={data.year}
                              description={data.description}
                              date={new Date(
                                 data?.oldPublishedAt || data?.publishedAt,
                              ).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric',
                              })}
                              sku={data.sku}
                              image={
                                 data?.highlightImage?.data?.attributes ||
                                 sampleImage
                              }
                           />
                        </div>
                     ))}
                  </Slider>
               </div>

               <CustomResearchCTA
                  ctaBanner={
                     data.homePage?.data.attributes
                        ?.latestResearchSectionCTABanner
                  }
               />
            </div>
         </section>
      )
   );
};

export default UpcomingReports;
