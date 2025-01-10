"use client";
import React, { useEffect, useMemo, useRef } from 'react';

interface Logo {
  attributes: {
    url: string;
    formats: {
      [key: string]: {
         url: string;
      };
    }
    alternativeText: string;
  };
}

interface BrandsMarqueeProps {
  logos: Logo[];
}

const BrandsMarquee: React.FC<BrandsMarqueeProps> = ({ logos }) => {

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate animation duration - allocate 2 seconds per logo
  const animationDuration = useMemo(() => {
    const secondsPerLogo = 2;
    return logos.length * secondsPerLogo;
  }, [logos.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.animationDuration = `${animationDuration}s`;
    }
  }, [animationDuration]);

  console.log({logos})
  
  return (
   <div className="relative w-full overflow-hidden bg-white py-6">
      <div 
      ref={containerRef}
      className="marquee-container flex whitespace-nowrap"
      >
      {/* First set of logos */}
      <div className="flex shrink-0 items-center">
         {logos.map((logo, index) => (
            <div key={`first-${index}`} className="mx-8 h-16 w-32 flex items-center justify-center">
            <img
               src={logo.attributes.formats?.thumbnail?.url || logo.attributes.url}
               alt={logo.attributes.alternativeText}
               className="h-full w-full object-contain"
               loading="lazy"
            />
            </div>
         ))}
      </div>
        {/* Second set of logos for seamless loop */}
        <div className="flex shrink-0 items-center">
          {logos.map((logo, index) => (
            <div key={`second-${index}`} className="mx-8 h-16 w-32 flex items-center justify-center">
              <img
                src={logo.attributes.formats?.thumbnail?.url || logo.attributes.url}
                alt={logo.attributes.alternativeText}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsMarquee;