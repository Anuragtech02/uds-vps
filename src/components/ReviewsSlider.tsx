'use client';
import { FC } from 'react';
// @ts-ignore
import Slider from 'react-slick';

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
      <div className='mx-auto w-2/3 py-10 pb-20'>
         <Slider {...settings}>
            {data.map((data, index) => (
               <div key={index} className='pr-4'>
                  <div className='rounded-lg bg-blue-2 px-10 py-8 text-white'>
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
