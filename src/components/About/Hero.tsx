import Button from '../commons/Button';
interface heroItem {
   heroHeading: string;
   heroPrimaryCTAButton: {
      title: string;
      link: string;
      id: number;
   };
   heroSecondaryCTAButton: {
      title: string;
      link: string;
      id: number;
   };
}
const Hero = ({ hero }: { hero: heroItem }) => {
   return (
      <section className='relative min-h-max flex-col bg-white pt-40'>
         <div className='container'>
            <div className='relative overflow-hidden rounded-lg border border-[#E2EDFA] py-10 md:py-16'>
               <div className='absolute inset-0 z-[1] mx-auto'>
                  <svg
                     className='mx-auto h-full w-full'
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
                     {/* UMI Helps <span>Achieving</span> Your Strategic{' '}
                     <span>Goals</span> */}
                     <div
                        dangerouslySetInnerHTML={{
                           __html: hero?.heroHeading || '',
                        }}
                     />
                     {/* {hero?.heroHeading} */}
                  </h1>
                  <div className='flex items-center justify-center gap-4 pt-6 md:pt-10'>
                     <Button variant='secondary'>
                        {hero?.heroPrimaryCTAButton?.title}
                     </Button>
                     <Button variant='light'>
                        {hero?.heroSecondaryCTAButton?.title}
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Hero;
