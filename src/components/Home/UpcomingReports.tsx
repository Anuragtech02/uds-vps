'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';

// @ts-ignore
import Slider from 'react-slick';
import CustomResearchCTA from '../commons/CustomResearchCTA';

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
      <section className='block'>
         <div className='container'>
            <h2>
               <span>Upcoming</span> reports
            </h2>

            <div className='my-8 md:my-16 md:mt-10'>
               <Slider {...settings}>
                  {sampleData.map((data, index) => (
                     <div key={index} className='pr-4'>
                        <ResearchCard
                           type='upcoming'
                           title={data.title}
                           year={data.year}
                           description={data.description}
                           date={data.date}
                           sku={data.sku}
                           image={data?.image || sampleImage}
                        />
                     </div>
                  ))}
               </Slider>
            </div>

            <CustomResearchCTA />
         </div>
      </section>
   );
};

export default UpcomingReports;
