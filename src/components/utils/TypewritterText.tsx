'use client';
import { useEffect, useRef } from 'react';

const markets = [
   'Energy Market',
   'Healthcare Market',
   'Retail Market',
   'Finance Market',
   'Education Market',
   'Manufacturing Market',
];

const TypewritterText = () => {
   const spanRef = useRef<HTMLSpanElement | null>(null);
   useEffect(() => {
      startTextAnimation(0);
   }, []);

   function typeWriter(text: string, i: number, fnCallback: () => void) {
      if (i < text.length) {
         spanRef.current!.innerHTML = text.substring(0, i + 1);

         setTimeout(function () {
            typeWriter(text, i + 1, fnCallback);
         }, 100);
      } else if (typeof fnCallback == 'function') {
         setTimeout(fnCallback, 700);
      }
   }

   function startTextAnimation(i: number) {
      if (typeof markets[i] == 'undefined') {
         startTextAnimation(0);
      }

      if (i < markets[i]?.length) {
         typeWriter(markets[i], 0, function () {
            startTextAnimation(i + 1);
         });
      } else {
         startTextAnimation(0);
      }
   }

   return (
      <>
         <span ref={spanRef}>Energey Market</span>
         <span className='caret'></span>
      </>
   );
};

export default TypewritterText;
