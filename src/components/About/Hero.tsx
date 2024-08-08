import Button from '../commons/Button';

const Hero = () => {
   return (
      <section className='relative min-h-max flex-col bg-white md:pt-40'>
         <div className='container relative overflow-hidden rounded-lg border border-[#E2EDFA] py-10 md:py-16'>
            <div className='absolute inset-0 z-[1] mx-auto'>
               <svg
                  className='mx-auto'
                  width='1183'
                  height='283'
                  viewBox='0 0 1183 283'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <circle
                     cx='591.5'
                     cy='-308.5'
                     r='591.5'
                     transform='rotate(-90 591.5 -308.5)'
                     fill='#FAFBFF'
                  />
                  <circle
                     cx='580.5'
                     cy='-360.5'
                     r='554.5'
                     transform='rotate(-90 580.5 -360.5)'
                     fill='#F3F7FF'
                  />
                  <circle
                     cx='581'
                     cy='-425'
                     r='521'
                     transform='rotate(-90 581 -425)'
                     fill='#E5EEFF'
                  />
               </svg>
            </div>
            <div className='relative z-[2] mx-auto w-[90%] text-center'>
               <h1>
                  UMI Helps <span>Achieving</span> Your Strategic{' '}
                  <span>Goals</span>
               </h1>
               <div className='flex items-center justify-center gap-4 pt-6 md:pt-10'>
                  <Button variant='secondary'>Our Services</Button>
                  <Button variant='light'>Contact Us</Button>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Hero;
