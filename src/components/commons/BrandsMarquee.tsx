import Marquee from 'react-fast-marquee';

const BrandsMarquee: React.FC<{ logos: any }> = ({ logos }) => {
   return (
      <div className='w-full max-w-[100vw]'>
         <Marquee gradient={false} speed={50} className='space-x-6'>
            {logos.map((logo: any, index: number) => (
               <div key={index} className='mx-10 grid place-items-center'>
                  <img
                     src={logo.attributes.url}
                     alt={logo.attributes.alternativeText}
                     className='h-auto w-full object-contain object-center'
                  />
               </div>
            ))}
         </Marquee>
      </div>
   );
};

export default BrandsMarquee;
