'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { FaArrowRightLong } from 'react-icons/fa6';
// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';
import PreBookCTA from '../commons/PreBookCTA';

const sampleData = [
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
   {
      title: 'Global Tech Summit 2024',
      year: '2023-2024',
      image: null,
   },
];

const LatestResearch: React.FC<{ data: any; reports: any }> = ({
   data,
   reports,
}) => {
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

   const latestResearchSection = {
      latestResearchSectionTitle:
         data.data.attributes.latestResearchSectionTitle,
      latestResearchSectionReportsCount:
         data.data.attributes.latestResearchSectionReportsCount,
      latestResearchSectionCTABanner: {
         title: data.data.attributes.latestResearchSectionCTABanner.title,
         type: data.data.attributes.latestResearchSectionCTABanner.type,
         ctaButton:
            data.data.attributes.latestResearchSectionCTABanner.ctaButton,
      },
   };

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
                  {reports.map((data: any, index: number) => (
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
                  ))}
               </Slider>
            </div>
            <div className='h-8'></div>
            <PreBookCTA
               title={
                  latestResearchSection.latestResearchSectionCTABanner.title
               }
               ctaButton={
                  latestResearchSection.latestResearchSectionCTABanner.ctaButton
               }
            />
         </div>
      </section>
   );
};

export default LatestResearch;
