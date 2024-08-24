'use client';
import { allCitations } from '@/assets/img/citations';
import { useCallback, useEffect, useMemo, useState } from 'react';

const MediaCitation = () => {
   const [shuffleAlternator, setShuffleAlternator] = useState<boolean>(false);

   const shuffleCitations = useCallback(() => {
      setShuffleAlternator((prev) => (prev === false ? true : false));
   }, []);

   useEffect(() => {
      shuffleCitations();
      const intervalId = setInterval(
         shuffleCitations,
         Math.floor(Math.random() * (3000 - 2000 + 1) + 2000),
      );
      return () => clearInterval(intervalId);
   }, [shuffleCitations]);

   return (
      <section className='bg-s-50 py-20 md:min-h-max'>
         <div className='container'>
            <div className='pb-10 text-center md:pb-16'>
               <h2>
                  Media <span>Citations</span>
               </h2>
               <p className='mx-auto mt-2 md:w-2/3 md:text-2xl'>
                  Contemplate and gaze at our reports cited by the
                  inquisitors/specialists of leading media/publishing houses.
               </p>
            </div>
            <div className='grid grid-cols-3 lg:grid-cols-5'>
               {allCitations.map((img: any, index: number) => (
                  <div
                     key={index}
                     className={`grid place-items-center px-4 py-5 md:px-10 ${index % 2 === 0 ? `${shuffleAlternator ? 'tile-white' : 'tile-gray'} ` : `${!shuffleAlternator ? 'tile-white' : 'tile-gray'} `}`}
                  >
                     <img
                        className='h-full w-full object-contain md:h-[80px]'
                        src={img.src}
                        alt={`Citation ${index + 1}`}
                     />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default MediaCitation;
