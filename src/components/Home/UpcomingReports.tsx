'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import Slider from 'react-slick';

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

const UpcomingReports = () => {
   const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4.2,
      arrows: false,
   };

   return (
      <section className='block'>
         <div className='container'>
            <h2>
               <span>Upcoming</span> reports
            </h2>

            <div className='my-8 md:my-16'>
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
            <div className='bg-gradient-radial relative overflow-hidden rounded-xl p-[1px]'>
               <div className='rounded-xl bg-white'>
                  <div className='rounded-xl bg-gradient-to-r from-[rgba(128,189,255,0.3)] via-[rgba(94,197,230,0.3)] to-[rgba(60,204,204,0.3)] px-10 py-8'>
                     <div className='md:w-2/3'>
                        <h2>
                           <span>Tailored insights</span> for your unique needs.{' '}
                           <br className='hidden md:block' /> Request a{' '}
                           <span>custom research</span> report now!
                        </h2>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default UpcomingReports;
