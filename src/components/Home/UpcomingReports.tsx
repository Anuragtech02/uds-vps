'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';

// @ts-ignore
import Slider from 'react-slick';
import CustomResearchCTA from '../commons/CustomResearchCTA';
import { SLICK_COMMON_SETTINGS } from '@/utils/constants';
import { getFormattedDate } from '@/utils/generic-methods';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

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
   const { locale } = useLocale();

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
      data?.upcomingReports?.length > 0 && (
         <section className='block min-h-max pb-12 md:pb-20'>
            <div className='container'>
               <h2>
                  <span>{TRANSLATED_VALUES[locale]?.report.upcoming}</span>{' '}
                  {TRANSLATED_VALUES[locale]?.report.reports}
               </h2>

               <div className='my-8 md:my-16 md:mt-10'>
                  {data?.upcomingReports?.length < 5 ? (
                     <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {data?.upcomingReports?.map(
                           (report: any, index: number) => (
                              <div key={index}>
                                 <ResearchCard
                                    key={index}
                                    type='latest'
                                    title={report?.title}
                                    slug={report?.slug}
                                    year={getYear(report)}
                                    image={
                                       report?.highlightImage?.data
                                          ?.attributes || sampleImage
                                    }
                                    date={getFormattedDate(report, locale)}
                                    locale={locale}
                                 />
                              </div>
                           ),
                        )}
                     </div>
                  ) : (
                     <Slider {...settings}>
                        {data?.upcomingReports?.map(
                           (report: any, index: number) => (
                              <div key={index} className='pr-4'>
                                 <ResearchCard
                                    key={index}
                                    type='latest'
                                    title={report?.title}
                                    slug={report?.slug}
                                    year={getYear(report)}
                                    image={
                                       report?.highlightImage?.data
                                          ?.attributes || sampleImage
                                    }
                                    date={getFormattedDate(report, locale)}
                                    locale={locale}
                                 />
                              </div>
                           ),
                        )}
                     </Slider>
                  )}
               </div>

               <CustomResearchCTA
                  ctaBanner={
                     data.homePage?.data.attributes
                        ?.latestResearchSectionCTABanner
                  }
                  locale={locale}
               />
            </div>
         </section>
      )
   );
};

export default UpcomingReports;
