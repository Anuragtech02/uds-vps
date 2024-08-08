import Marquee from 'react-fast-marquee';
import asianPaints from '@/assets/img/brands/asianpaints.png';
import bosch from '@/assets/img/brands/bosch.png';
import johnsons from '@/assets/img/brands/johnsons.png';
import tata from '@/assets/img/brands/tata.png';

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

const BrandsMarquee = () => {
   return (
      <div className='w-full max-w-[100vw]'>
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
   );
};

export default BrandsMarquee;
