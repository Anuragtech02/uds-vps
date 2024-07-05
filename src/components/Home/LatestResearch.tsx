'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
// @ts-ignore
import Slider from 'react-slick';

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
      <section>
         <div className='container'>
            <h2>
               Our <span>lastest</span> research
            </h2>
            <div className='my-8 md:my-16'>
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
         </div>
      </section>
   );
};

export default LatestResearch;
