'use client';
import { allCitations } from '@/assets/img/citations';
import { useCallback, useEffect, useMemo, useState } from 'react';

const MediaCitation: React.FC<{ mediaCitation: any }> = ({ mediaCitation }) => {
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
      <section className='bg-s-50 py-8 md:min-h-max'>
         <div className='container'>
            <div className='pb-10 text-center md:pb-16'>
               <h2
                  dangerouslySetInnerHTML={{
                     __html: mediaCitation?.mediaSectionTitle,
                  }}
               ></h2>
               <p className='mx-auto mt-2 md:w-2/3 md:text-2xl'>
                  {mediaCitation?.mediaSectionDescription}
               </p>
            </div>
            <div className='grid grid-cols-3 lg:grid-cols-5'>
               {mediaCitation?.mediaSecrtionLogos?.map(
                  (img: any, index: number) => (
                     <div
                        key={index}
                        className={`grid place-items-center px-4 py-5 md:px-10 ${index % 2 === 0 ? `${shuffleAlternator ? 'tile-white' : 'tile-gray'} ` : `${!shuffleAlternator ? 'tile-white' : 'tile-gray'} `}`}
                     >
                        <img
                           className='h-full w-full object-contain md:h-[80px]'
                           src={img.url}
                           alt={`Citation ${index + 1}`}
                        />
                     </div>
                  ),
               )}
            </div>
         </div>
      </section>
   );
};

export default MediaCitation;
