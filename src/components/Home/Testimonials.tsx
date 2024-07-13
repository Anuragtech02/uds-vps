import Marquee from 'react-fast-marquee';

import asianPaints from '@/assets/img/brands/asianpaints.png';
import bosch from '@/assets/img/brands/bosch.png';
import johnsons from '@/assets/img/brands/johnsons.png';
import tata from '@/assets/img/brands/tata.png';
import ReviewsSlider from '../ReviewsSlider';

const brandImages = [
   { src: asianPaints, alt: 'Asian Paints' },
   { src: bosch, alt: 'Bosch' },
   { src: johnsons, alt: 'Johnsons' },
   { src: tata, alt: 'Tata' },
   { src: asianPaints, alt: 'Asian Paints' },
   { src: bosch, alt: 'Bosch' },
   { src: johnsons, alt: 'Johnsons' },
   { src: tata, alt: 'Tata' },
];

const testimonials = [
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'John Doe',
      designation: 'CEO, Company',
   },
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'John Doe',
      designation: 'CEO, Company',
   },
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'John Doe',
      designation: 'CEO, Company',
   },
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'John Doe',
      designation: 'CEO, Company',
   },
];

const Testimonials = () => {
   return (
      <section className='min-h-full flex-col'>
         <div className='container py-10'>
            <h2>
               Brands that <span>trust us!</span>
            </h2>
         </div>
         <div className='my-10 bg-white py-10'>
            <Marquee gradient={false} speed={50} className='space-x-6'>
               {brandImages.map((brand, index) => (
                  <div key={index} className='mx-10 grid place-items-center'>
                     <img
                        src={brand.src.src}
                        alt={brand.alt}
                        className='h-auto w-full object-contain object-center'
                     />
                  </div>
               ))}
            </Marquee>
         </div>
         <div className='relative z-[1] w-full bg-blue-1 py-10'>
            <div className='container'>
               <h2 className='text-center text-white'>
                  Read what our trusted{' '}
                  <span className='text-white'>customers</span> say
               </h2>
               <div>
                  <ReviewsSlider data={testimonials} />
               </div>
            </div>
         </div>
      </section>
   );
};

export default Testimonials;
