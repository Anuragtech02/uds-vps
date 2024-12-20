'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { SLICK_COMMON_SETTINGS } from '@/utils/constants';
// @ts-ignore
import Slider from 'react-slick';

const ExploreProjects = ({ reports }: { reports: any[] }) => {
   const settings = SLICK_COMMON_SETTINGS;
   return (
      <section className='block min-h-max'>
         <div className='container'>
            <h2>
               <span>Related</span> Reports
            </h2>
            <p className='text-medium mt-2'>
               Customers who bought this item also bought
            </p>

            <div className='my-8 md:my-16 md:mt-10'>
               <Slider {...settings}>
                  {reports.map((data: any, index: number) => (
                     <div key={index} className='pr-4'>
                        <ResearchCard
                           type='upcoming'
                           title={data?.title}
                           year={new Date(
                              data?.oldPublishedAt || data?.publishedAt || new Date().getTime(),
                           )
                              ?.getFullYear()
                              .toString()}
                           description={data?.shortDescription}
                           date={new Date(data?.oldPublishedAt || data?.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                           slug={data?.slug}
                           image={
                              data?.highlightImage?.data?.attributes?.url ||
                              sampleImage
                           }
                        />
                     </div>
                  ))}
               </Slider>
            </div>
         </div>
         {/* <div className='my-8 md:my-16 md:mt-10'>
            <p className='text-center text-2xl text-blue-4'>
               Trusted by Companies.{' '}
               <span className='font-bold'>Big and Small.</span>
            </p>
            <div className='py-6 md:py-10'>
               <BrandsMarquee logos={[]} />
            </div>
            <div className='container py-10 md:py-16'>
            </div>
         </div> */}
      </section>
   );
};

export default ExploreProjects;
