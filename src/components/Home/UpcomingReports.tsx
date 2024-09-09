'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';

// @ts-ignore
import Slider from 'react-slick';
import CustomResearchCTA from '../commons/CustomResearchCTA';
import dynamic from 'next/dynamic';

const sampleData = [
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
   {
      type: 'software',
      title: 'CloudMaster Pro',
      image: '',
      description:
         'Streamline your cloud infrastructure management with our powerful software solution.',
      cta: 'Start Free Trial',
      year: '2024',
      date: 'July 12th, 2025',
      id: 'SOFT001',
      sku: 'S001CM2024',
   },
];

const UpcomingReports: React.FC<{ data: any }> = ({ data }) => {
   const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4.2,
      arrows: false,
      dynamicHeight: false,
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

   return (
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
                              data.publishedAt,
                           ).toLocaleDateString()}
                           sku={data.sku}
                           image={data?.image || sampleImage}
                        />
                     </div>
                  ))}
               </Slider>
            </div>

            <CustomResearchCTA
               ctaBanner={
                  data.homePage?.data.attributes?.latestResearchSectionCTABanner
               }
            />
         </div>
      </section>
   );
};

export default UpcomingReports;
