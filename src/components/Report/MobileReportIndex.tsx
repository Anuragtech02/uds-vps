'use client';
import { useSelectedLicenseStore } from '@/stores/selectedLicense.store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

interface License {
   title: string;
   description: string;
   price: {
      amount: number;
      currency: string;
   };
}

interface NavigationItem {
   title: string;
   id: string;
}

interface MobileReportBlockProps {
   reportIndex: NavigationItem[];
   variants: License[];
   rightSectionHeading: string;
}

const formatCurrency = (amount: number, currency: string) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(amount);
};

const getDiscountPercentage = (index: number): number => {
   switch (index) {
      case 0: // Single license
         return 10;
      case 1: // Site license
         return 20;
      case 2: // Global license
         return 30;
      default:
         return 0;
   }
};

const calculateDiscountedPrice = (
   price: number,
   discountPercentage: number,
): number => {
   return Math.round(price * (1 - discountPercentage / 100));
};

// Add this hook for mobile scroll tracking
const useMobileScrollSpy = (sectionIds: string[]) => {
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

const MobileReportBlock: React.FC<MobileReportBlockProps> = ({
   reportIndex,
   variants,
   rightSectionHeading,
}) => {
   const [isLicenseOpen, setIsLicenseOpen] = useState(false);
   const [showSecondHeader, setShowSecondHeader] = useState(false);
   const sectionIds = reportIndex.map((item) => item.id);
   const activeTab = useMobileScrollSpy(sectionIds);
   const [selectedLicense, setSelectedLicense] = useState<number | null>(null);
   const selectedLicenses = useSelectedLicenseStore();

   // Improved scroll function with dynamic header height
   const scrollToSection = useCallback((id: string) => {
      const header1 = document.getElementById('report-header');
      const header2 = document.querySelector('.mobile-second-header');
      const totalHeaderHeight =
         (header1?.clientHeight || 0) + (header2?.clientHeight || 0) + 10;

      const element = document.getElementById(id);
      if (element) {
         const top = element.offsetTop - 100;
         window.scrollTo({
            top,
            behavior: 'smooth',
         });
      }
   }, []);

   const toggleLicense = (index: number) => {
      setSelectedLicense(selectedLicense === index ? null : index);
   };

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         const reportHeader = document.getElementById('report-header');
         const header1Height = reportHeader?.clientHeight || 0;
         setShowSecondHeader(scrollPosition > header1Height + 130);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      showSecondHeader && (
         <div className='lg:hidden'>
            {/* Fixed Tab Navigation */}
            <div className='fixed left-0 right-0 top-0 z-40 bg-white shadow-sm'>
               <div className='scrollbar-hide overflow-x-auto'>
                  <div className='flex min-w-full whitespace-nowrap'>
                     {reportIndex.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => {
                              scrollToSection(item.id);
                           }}
                           className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium ${
                              activeTab === item.id
                                 ? 'border-blue-2 bg-blue-50 text-blue-2'
                                 : 'border-transparent text-gray-500 hover:text-gray-700'
                           }`}
                        >
                           {item.title}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Fixed License Selection at Bottom */}
            <div className='fixed bottom-[75px] left-0 right-0 z-40 border-t border-gray-200 bg-white'>
               <div className='p-4 pb-0'>
                  <button
                     onClick={() => setIsLicenseOpen(!isLicenseOpen)}
                     className='flex w-full items-center justify-between rounded-lg bg-blue-50 px-4 py-2'
                  >
                     {/* <span className='font-medium'>{rightSectionHeading}</span> */}
                     <span className='font-medium'>License Options</span>
                     {isLicenseOpen ? (
                        <BiChevronUp className='h-5 w-5' />
                     ) : (
                        <BiChevronDown className='h-5 w-5' />
                     )}
                  </button>

                  {isLicenseOpen && (
                     <div className='absolute bottom-full left-0 right-0 max-h-[60vh] overflow-y-auto border-t border-gray-200 bg-white p-4 shadow-lg'>
                        <div className='space-y-3'>
                           {variants.map((license, index) => {
                              const discountPercentage =
                                 getDiscountPercentage(index);
                              const discountedPrice = calculateDiscountedPrice(
                                 license.price.amount,
                                 discountPercentage,
                              );

                              return (
                                 <div
                                    key={index}
                                    className={`rounded-md border border-s-300 transition-all duration-150 ${
                                       selectedLicense === index
                                          ? 'border-blue-2'
                                          : ''
                                    }`}
                                 >
                                    <div
                                       className='cursor-pointer px-4 py-3'
                                       onClick={() => toggleLicense(index)}
                                    >
                                       <div className='flex items-start justify-between'>
                                          <div className='flex items-start gap-3'>
                                             <input
                                                type='radio'
                                                className='mt-1.5'
                                                checked={
                                                   selectedLicense === index
                                                }
                                                onChange={() =>
                                                   toggleLicense(index)
                                                }
                                                id={`mobile-license-${index}`}
                                             />
                                             <div>
                                                <label
                                                   htmlFor={`mobile-license-${index}`}
                                                   className='block text-sm font-semibold'
                                                >
                                                   {license.title}
                                                </label>
                                             </div>
                                          </div>
                                          <div className='flex flex-col items-end'>
                                             <p className='text-sm text-red-500 line-through'>
                                                {formatCurrency(
                                                   license.price.amount,
                                                   license.price.currency,
                                                )}
                                             </p>
                                             <div className='flex items-center gap-1'>
                                                <span className='text-md font-semibold text-green-1'>
                                                   {formatCurrency(
                                                      discountedPrice,
                                                      license.price.currency,
                                                   )}
                                                </span>
                                                <span className='text-sm text-green-700'>
                                                   (-{discountPercentage}%)
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    {selectedLicense === index && (
                                       <div
                                          dangerouslySetInnerHTML={{
                                             __html: license.description,
                                          }}
                                          className='report-content border-t border-s-200 bg-gray-50 px-4 py-3 text-sm [&>p]:mb-0 [&>ul>li]:!mb-0 [&>ul]:!list-disc'
                                       />
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )
   );
};

export default MobileReportBlock;
