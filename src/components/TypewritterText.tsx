'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const DUMMY_MARKETS = [
   'Energy Market',
   'Aerospace Market',
   'Automotive Market',
   'Agriculture Market',
   'Telecom & IT Market',
   'Chemical Market',
];

const TypewriterText: React.FC<{
   markets: string[];
}> = ({ markets = DUMMY_MARKETS }) => {
   const [text, setText] = useState('');
   const [marketIndex, setMarketIndex] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);

   const typeSpeed = 100;
   const deleteSpeed = 50;
   const pauseBeforeDelete = 2000;
   const pauseBeforeNextWord = 500;

   const typeEffect = useCallback(() => {
      const currentMarket = markets[marketIndex];

      if (isDeleting) {
         setText(currentMarket.substring(0, text.length - 1));
      } else {
         setText(currentMarket.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentMarket) {
         setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && text === '') {
         setIsDeleting(false);
         setMarketIndex((prevIndex) => (prevIndex + 1) % markets.length);
         setTimeout(() => {}, pauseBeforeNextWord);
      }
   }, [text, marketIndex, isDeleting]);

   useEffect(() => {
      const timer = setTimeout(
         typeEffect,
         isDeleting ? deleteSpeed : typeSpeed,
      );
      return () => clearTimeout(timer);
   }, [typeEffect, isDeleting]);

   return (
      <>
         <span>{text}</span>
         <span className='caret'></span>
      </>
   );
};

export default TypewriterText;
