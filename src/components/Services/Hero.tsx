import ServicesGrid from './ServicesGrid';

interface heroItem {
   heroSectionHeading: string;
   heroSectionDescription: string;
}

interface ServiceItem {
   slug: string;
   title: string;
}

const Hero = ({
   hero,
   services,
}: {
   hero: heroItem;
   services: ServiceItem[];
}) => {
   return (
      <section className='relative min-h-max flex-col bg-white pt-40'>
         <div className='container'>
            <div className='relative overflow-hidden rounded-lg border border-[#E2EDFA] py-10 md:py-16'>
               <div className='absolute top-[0px] z-[1] mx-auto sm:inset-0'>
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
                     <div
                        dangerouslySetInnerHTML={{
                           __html: hero?.heroSectionHeading || '',
                        }}
                     />
                  </h1>
                  <p className='mx-auto mt-4 max-w-[80%]'>
                     {hero?.heroSectionDescription}
                  </p>
                  <ServicesGrid services={services} />
               </div>
            </div>
         </div>
      </section>
   );
};

export default Hero;
