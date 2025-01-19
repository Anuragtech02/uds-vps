'use client'; // Add this for Next.js 13+ client components

import React, { useState, useEffect, useCallback } from 'react';
import StrapiImage from '../StrapiImage/StrapiImage';

interface StatData {
   title: string;
   countTo: number;
   icon: {
      url: string;
   };
}

const Counter: React.FC<{ end: number; duration: number }> = ({
   end,
   duration,
}) => {
   const [count, setCount] = useState(0);

   useEffect(() => {
      let startTimestamp: number | null = null;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
         if (!startTimestamp) startTimestamp = timestamp;
         const progress = timestamp - startTimestamp;
         const percentage = Math.min(progress / duration, 1);

         // Easing function for smooth animation
         const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
         const currentCount = Math.floor(easeOutQuart * end);

         setCount(currentCount);

         if (percentage < 1) {
            animationFrameId = requestAnimationFrame(animate);
         }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
         if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
         }
      };
   }, [end, duration]);

   return count;
};

const Stats: React.FC<{ data: StatData[] }> = ({ data }) => {
   const [isVisible, setIsVisible] = useState(false);
   const containerRef = React.useRef<HTMLDivElement>(null);

   const onScroll = useCallback(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInViewport && !isVisible) {
         setIsVisible(true);
      }
   }, [isVisible]);

   useEffect(() => {
      window.addEventListener('scroll', onScroll);
      // Trigger check on initial load
      onScroll();

      return () => window.removeEventListener('scroll', onScroll);
   }, [onScroll]);

   return (
      <div>
         <h3>Key Figures</h3>
         <div
            ref={containerRef}
            className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'
         >
            {data.map((stat) => (
               <div
                  key={stat.title}
                  className='relative flex flex-col justify-between rounded-md border border-s-200 bg-white p-4'
               >
                  <p>{stat.title}</p>
                  <h3 className='mt-6 font-bricolage text-4xl font-bold text-blue-4 md:text-6xl'>
                     {isVisible ? (
                        <>
                           <Counter end={stat.countTo} duration={2000} />+
                        </>
                     ) : (
                        '0+'
                     )}
                  </h3>
                  <img
                     src={stat.icon.url}
                     className='absolute bottom-0 right-0 aspect-square h-20'
                     alt=''
                  />
               </div>
            ))}
         </div>
      </div>
   );
};

export default Stats;
