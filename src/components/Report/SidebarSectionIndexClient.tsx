'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
   reportData: {
      faqList: [];
      id: number;
   };
}

// Custom hook for middle-screen detection
const useMiddleScreenScrollSpy = (sectionIds: string[]) => {
   const [activeSection, setActiveSection] = useState(sectionIds[0]);
   const sections = useRef<Array<{ id: string; top: number; bottom: number }>>(
      [],
   );
   const rafId = useRef<number>();
   const headerHeight = useRef(0);

   const calculatePositions = useCallback(() => {
      headerHeight.current =
         document.querySelector('header')?.clientHeight || 0;

      sections.current = sectionIds.map((id) => {
         const el = document.getElementById(id);
         if (!el) return { id, top: 0, bottom: 0 };

         const rect = el.getBoundingClientRect();
         return {
            id,
            top: rect.top + window.scrollY - headerHeight.current,
            bottom: rect.bottom + window.scrollY - headerHeight.current,
         };
      });
   }, [sectionIds]);

   const handleScroll = useCallback(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let closestSection = activeSection;
      let smallestDistance = Infinity;

      sections.current.forEach(({ id, top, bottom }) => {
         if (scrollPosition >= top && scrollPosition <= bottom) {
            const distance = Math.abs(scrollPosition - (top + bottom) / 2);
            if (distance < smallestDistance) {
               smallestDistance = distance;
               closestSection = id;
            }
         }
      });

      if (closestSection !== activeSection) {
         setActiveSection(closestSection);
      }
   }, [activeSection]);

   useEffect(() => {
      // Initial calculation
      calculatePositions();

      // Throttled scroll handler
      const scrollThrottle = () => {
         if (!rafId.current) {
            rafId.current = requestAnimationFrame(() => {
               handleScroll();
               rafId.current = undefined;
            });
         }
      };

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
         calculatePositions();
         handleScroll();
      });

      // Observe all sections
      sectionIds.forEach((id) => {
         const el = document.getElementById(id);
         if (el) resizeObserver.observe(el);
      });

      window.addEventListener('scroll', scrollThrottle);
      window.addEventListener('resize', calculatePositions);

      return () => {
         window.removeEventListener('scroll', scrollThrottle);
         window.removeEventListener('resize', calculatePositions);
         resizeObserver.disconnect();
         if (rafId.current) cancelAnimationFrame(rafId.current);
      };
   }, [calculatePositions, handleScroll, sectionIds]);

   return activeSection;
};

const scrollToSection = (id: string) => {
   const element = document.getElementById(id);
   if (element) {
      const headerOffset = 200; // Add margin from top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
         elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
         top: offsetPosition,
         behavior: 'smooth',
      });
   }
};

const reportIndex = [
   // { title: 'About this report', id: 'about-report' },
   { title: 'Report Description', id: 'report-data' },
   { title: 'Table of content', id: 'table-of-content' },
   { title: 'Research Methodology', id: 'research-methodology' },
   { title: 'FAQs', id: 'faq-section' },
];

const SidebarSectionIndex: React.FC<Props> = ({ reportData }) => {
   const sectionIds = reportIndex.map((item) => item.id);
   const activeSection = useMiddleScreenScrollSpy(sectionIds);

   return (
      <div className='w-full rounded-md border border-s-400 bg-white'>
         <ul className='list-none p-0'>
            {reportIndex
               .filter((idx) =>
                  idx.title === 'FAQs' ? reportData.faqList?.length > 0 : true,
               )
               .map((item, index) => (
                  <li
                     key={index}
                     className={`cursor-pointer px-4 py-2 transition-all duration-150 ${
                        item.id === activeSection
                           ? 'border-y border-s-300 bg-blue-2 font-semibold text-white'
                           : ''
                     }`}
                     onClick={() => {
                        scrollToSection(item.id);
                     }}
                  >
                     {item.title}
                  </li>
               ))}
         </ul>
      </div>
   );
};

export default SidebarSectionIndex;
