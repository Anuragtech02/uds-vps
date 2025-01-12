import ReviewsSlider from '../ReviewsSlider';
import BrandsMarquee from '../commons/BrandsMarquee';

const Testimonials: React.FC<{ data: any }> = ({ data }) => {
   const testimonialsList =
      data.data.attributes.testimonialSectionTestimonials.data.map(
         (testimonial: any) => ({
            review: testimonial.attributes.description,
            name: testimonial.attributes.name,
            designation: testimonial.attributes.designation,
         }),
      );

   const bankLogos = data.data.attributes.brandsSecetionBankLogos.data;

   return (
      <section className='min-h-full flex-col overflow-x-hidden'>
         <div className='bg-white'>
            <div className='container pt-8'>
               <h2>
                  Brands that <span>trust us!</span>
               </h2>
            </div>
            <div className='my-4 bg-white py-6 md:my-0 md:py-10'>
               <BrandsMarquee logos={bankLogos} />
            </div>
         </div>
         <div className='relative z-[1] w-full bg-blue-1 py-10'>
            <div className='container'>
               <h2 className='text-center text-white'>
                  Read what our trusted{' '}
                  <span className='text-white'>customers</span> say
               </h2>
               <div>
                  <ReviewsSlider data={testimonialsList} />
               </div>
            </div>
         </div>
      </section>
   );
};

export default Testimonials;
