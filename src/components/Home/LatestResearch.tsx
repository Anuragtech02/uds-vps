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

const LatestResearch = () => {
   const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5.2,
      arrows: false,
   };
   return (
      <section className='min-h-full py-10 md:py-20'>
         <div className='container'>
            <h2>
               Our <span>lastest</span> research
            </h2>
            <div className='my-8 md:my-10'>
               <Slider {...settings}>
                  {sampleData.map((data, index) => (
                     <div key={index} className='pr-4'>
                        <ResearchCard
                           key={index}
                           type='latest'
                           title={data.title}
                           year={data.year}
                           image={data?.image || sampleImage}
                        />
                     </div>
                  ))}
               </Slider>
            </div>
            <div className='h-8'></div>
            <PreBookCTA />
         </div>
      </section>
   );
};

export default LatestResearch;
