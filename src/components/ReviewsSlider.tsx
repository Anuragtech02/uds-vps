'use client';
import { FC } from 'react';
// @ts-ignore
import Slider from 'react-slick';
import { QuoteLeft, QuoteRight } from './commons/Icons';

interface ReviewsSliderProps {
   data: {
      review: string;
      name: string;
      designation: string;
   }[];
}

const ReviewsSlider: FC<ReviewsSliderProps> = ({ data }) => {
   const settings = {
      autoPlay: true,
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      easing: 'ease-in-out',
   };

   return (
      <div className='relative mx-auto w-2/3 py-10 pb-20'>
         <div className='absolute -left-10 bottom-5 z-[5]'>
            <QuoteLeft />
         </div>
         <div className='absolute -right-10 top-0 z-[5]'>
            <QuoteRight />
         </div>
         <Slider {...settings}>
            {data.map((data, index) => (
               <div key={index} className='pr-4'>
                  <div className='rounded-lg bg-blue-2 px-10 py-8 text-white md:px-16'>
                     <p className='text-xl'>{data.review}</p>

                     <div className='mt-6'>
                        <h3 className='text-xl font-semibold text-white'>
                           {data.name}
                        </h3>
                        <p className='uppercase'>{data.designation}</p>
                     </div>
                  </div>
               </div>
            ))}
         </Slider>
      </div>
   );
};

export default ReviewsSlider;
