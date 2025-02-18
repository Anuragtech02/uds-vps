'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import StrapiImage, { Media } from '../StrapiImage/StrapiImage';

interface Logo {
   attributes: Media;
}

interface BrandsMarqueeProps {
   logos: Logo[];
}

const BrandsMarquee: React.FC<BrandsMarqueeProps> = ({ logos }) => {
   const containerRef = useRef<HTMLDivElement>(null);

   // Calculate animation duration - allocate 2 seconds per logo
   const animationDuration = useMemo(() => {
      const secondsPerLogo = 1 / 2;
      return logos.length * secondsPerLogo;
   }, [logos.length]);

   useEffect(() => {
      const container = containerRef.current;
      if (container) {
         container.style.animationDuration = `${animationDuration}s`;
      }
   }, [animationDuration]);

   return (
      <div className='relative w-full overflow-hidden bg-white py-6'>
         <div
            ref={containerRef}
            className='marquee-container flex whitespace-nowrap'
         >
            {/* First set of logos */}
            <div className='flex shrink-0 items-center'>
               {logos.map((logo, index) => (
                  <div
                     key={`first-${index}`}
                     className='mx-8 flex h-16 w-32 items-center justify-center'
                  >
                     <StrapiImage
                        wrapperClassName='w-full h-full flex justify-center items-center p-2'
                        media={logo.attributes}
                        objectFit='contain'
                        alt={logo.attributes.alternativeText}
                        className='h-full w-full object-contain'
                        loading='lazy'
                        size='thumbnail'
                     />
                  </div>
               ))}
            </div>
            {/* Second set of logos for seamless loop */}
            <div className='flex shrink-0 items-center'>
               {logos.map((logo, index) => (
                  <div
                     key={`second-${index}`}
                     className='mx-8 flex h-16 w-32 items-center justify-center'
                  >
                     <StrapiImage
                        wrapperClassName='w-full h-full flex justify-center items-center p-2'
                        media={logo.attributes}
                        objectFit='contain'
                        size='thumbnail'
                        alt={logo.attributes.alternativeText}
                        className='h-full w-full object-contain'
                        loading='lazy'
                     />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default BrandsMarquee;
