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
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      cssEase: 'ease-in-out',
   };

   return (
      <div className='relative mx-auto py-10 pb-20 lg:w-2/3'>
         <div className='absolute -left-5 bottom-5 z-[5] md:-left-10'>
            <QuoteLeft />
         </div>
         <div className='absolute -right-5 top-0 z-[5] md:-right-10'>
            <QuoteRight />
         </div>
         <Slider {...settings}>
            {data.map((data, index) => (
               <div key={index} className='pr-4'>
                  <div className='rounded-lg bg-blue-2 px-10 py-8 text-white md:px-16'>
                     <p className='md:text-xl'>{data.review}</p>

                     <div className='mt-6'>
                        <h3 className='font-semibold text-white md:text-xl'>
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
