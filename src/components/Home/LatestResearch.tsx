'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { FaArrowRightLong } from 'react-icons/fa6';
// @ts-ignore
import Slider from 'react-slick';
import Button from '../commons/Button';

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
            <div className='rounded-xl bg-gradient-to-r from-[#415496] via-[#1D63BE] to-[#2C8DBF] p-8 text-white'>
               <div className='mx-auto flex w-3/4 items-center gap-6'>
                  <h2 className='text-white'>
                     <span className='text-white'>Pre book</span> this report
                     and get huge discounts!
                  </h2>
                  <Button
                     size='large'
                     variant='light'
                     className='shrink-0 grow-0'
                     icon={<FaArrowRightLong />}
                  >
                     Get in touch
                  </Button>
               </div>
            </div>
         </div>
      </section>
   );
};

export default LatestResearch;
