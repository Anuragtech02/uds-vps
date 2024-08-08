import Marquee from 'react-fast-marquee';
import ReviewsSlider from '../ReviewsSlider';
import BrandsMarquee from '../commons/BrandsMarquee';

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
      name: 'Doe',
      designation: 'CEO, Company',
   },
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'John',
      designation: 'CEO, Company',
   },
   {
      review:
         'Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      name: 'Anurag',
      designation: 'CEO, Company',
   },
];

const Testimonials = () => {
   return (
      <section className='min-h-full flex-col'>
         <div className='bg-s-50'>
            <div className='container py-10'>
               <h2>
                  Brands that <span>trust us!</span>
               </h2>
            </div>
            <div className='my-10 bg-white py-10'>
               <BrandsMarquee />
            </div>
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
