'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';

// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import BrandsMarquee from '../commons/BrandsMarquee';
import PreBookCTA from '../commons/PreBookCTA';

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

const ExploreProjects = ({ reports }: { reports: any[] }) => {
   const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 4.2,
      slidesToScroll: 1,
      arrows: false,
      dynamicHeight: false,
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
