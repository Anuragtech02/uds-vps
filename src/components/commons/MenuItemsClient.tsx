'use client';

import { BiChevronDown } from 'react-icons/bi';
import { LocalizedLink } from './LocalizedLink';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

// Create dynamic imports for industry icons
const AerospaceAndDefense = dynamic(
   () => import('../icons/industries/aerospace-and-defense'),
);
const AgricultureIcon = dynamic(
   () => import('../icons/industries/agriculture'),
);
const ArtificialInitelligenceAnalytics = dynamic(
   () => import('../icons/industries/artificial-intelligence-analytics'),
);
const Automotive = dynamic(() => import('../icons/industries/automotive'));
const Banking = dynamic(() => import('../icons/industries/banking'));
const BuildingMaterial = dynamic(
   () => import('../icons/industries/building-material'),
);
const Chemical = dynamic(() => import('../icons/industries/chemical'));
const ConsumerGoods = dynamic(
   () => import('../icons/industries/consumer-good'),
);
const ElectronicsAndSemiconductor = dynamic(
   () => import('../icons/industries/electronics-semiconductor'),
);
const EnergyAndPower = dynamic(
   () => import('../icons/industries/energy-and-power'),
);
const Healthcare = dynamic(() => import('../icons/industries/healthcare'));
const MediaEntertainment = dynamic(
   () => import('../icons/industries/media-entertainment'),
);
const MinigMachinery = dynamic(
   () => import('../icons/industries/mining-machinery'),
);
const TelecomeIT = dynamic(() => import('../icons/industries/telecom-it'));

// Create a placeholder component for lazy-loaded icons
const IconPlaceholder = () => (
   <div className='h-5 w-5 animate-pulse rounded-sm bg-gray-200'></div>
);

// Create an object mapping industry slugs to their respective icons
const industryIcons: {
   [key: string]: React.ReactNode;
} = {
   'aerospace-and-defence': <AerospaceAndDefense />,
   agriculture: <AgricultureIcon />,
   'artificial-intelligence-analytics': <ArtificialInitelligenceAnalytics />,
   automotive: <Automotive />,
   'banking-financial-services-and-insurance': <Banking />,
   'building-material-and-construction': <BuildingMaterial />,
   chemical: <Chemical />,
   'consumer-goods': <ConsumerGoods />,
   'electronics-semiconductor': <ElectronicsAndSemiconductor />,
   'energy-and-power': <EnergyAndPower />,
   healthcare: <Healthcare />,
   'media-entertainment': <MediaEntertainment />,
   'mining-machinery': <MinigMachinery />,
   'telecom-it': <TelecomeIT />,
};

interface MenuItem {
   title: string;
   url: string;
   children?: MenuItem[];
}

export const MobileMenuItem: React.FC<{
   item: MenuItem;
   depth: number;
   onClick: () => void;
}> = ({ item, depth, onClick }) => {
   const [isOpen, setIsOpen] = useState(false);
   const { locale } = useLocale();

   return (
      <li className={`w-full ${depth > 0 ? 'pl-4' : ''}`}>
         {item.children && item.children.length > 0 ? (
            <>
               <div
                  className='flex w-full items-center justify-between px-2 py-3 text-white hover:bg-blue-2'
                  onClick={(e) => {
                     e.stopPropagation(); // Prevent event from bubbling up
                     setIsOpen(!isOpen);
                  }}
               >
                  <span className='break-words pr-2'>{item.title}</span>
                  <BiChevronDown
                     className={`ml-1 flex-shrink-0 text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
                  />
               </div>
               {isOpen && (
                  <div>
                     <ul className='w-full'>
                        {item.children.map((child, index) => (
                           <MobileMenuItem
                              key={index}
                              item={child}
                              depth={depth + 1}
                              onClick={onClick}
                           />
                        ))}
                     </ul>
                  </div>
               )}
            </>
         ) : (
            <LocalizedLink
               href={item.url ?? ''}
               className='flex w-full items-center px-2 py-3 text-white hover:bg-blue-2'
               onClick={(e: any) => {
                  e.stopPropagation();
                  onClick();
               }}
               lang={locale}
            >
               {depth > 0 && item.url?.includes('industries=') && (
                  <div className='mr-2'>
                     {industryIcons[
                        item.url.split('industries=')[1]?.split('&')[0]
                     ] || <IconPlaceholder />}
                  </div>
               )}
               <span className='break-words'>{item.title}</span>
            </LocalizedLink>
         )}
      </li>
   );
};

export const DesktopMenuItem: React.FC<{ item: MenuItem; depth: number }> = ({
   item,
   depth,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const { locale } = useLocale();

   const handleMouseEnter = () => setIsOpen(true);
   const handleMouseLeave = () => setIsOpen(false);

   if (item.title?.toLowerCase()?.includes('industr')) {
      return (
         <li
            className='dropdown-menu relative'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
         >
            <div className='flex cursor-pointer items-center rounded-md px-2 py-2 text-white hover:bg-blue-3'>
               <span className='max-w-[200px] whitespace-normal break-words'>
                  {TRANSLATED_VALUES[locale].header?.[
                     item.title.toLowerCase()
                  ] ||
                     TRANSLATED_VALUES[locale]?.services[item.title] ||
                     item.title}
               </span>
               <BiChevronDown
                  className={`ml-1 flex-shrink-0 text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
               />
            </div>
            {isOpen && (
               <div className='absolute left-0 top-full z-50 pt-2'>
                  <div className='rounded-md border border-s-400 bg-white p-6 shadow-md'>
                     <div
                        style={{ columnCount: 2 }}
                        className='min-w-[300px] lg:min-w-[600px]'
                     >
                        {item.children?.map((child, index) => (
                           <LocalizedLink
                              key={index}
                              href={child.url ?? ''}
                              className='flex items-start break-words py-2 text-s-800 hover:text-blue-600'
                              lang={locale}
                           >
                              {child.url?.includes('industries=') && (
                                 <div className='mr-2'>
                                    {industryIcons[
                                       child.url
                                          .split('industries=')[1]
                                          ?.split('&')[0]
                                    ] || <IconPlaceholder />}
                                 </div>
                              )}
                              <span className='-mt-1'>
                                 {
                                    TRANSLATED_VALUES[locale]?.industries?.[
                                       child.title
                                    ]
                                 }
                              </span>
                           </LocalizedLink>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </li>
      );
   }

   return (
      <li
         className={`dropdown-menu relative ${depth > 0 ? 'w-full' : ''}`}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         {item.children && item.children.length > 0 ? (
            <>
               <LocalizedLink href={item.url ?? ''} lang={locale}>
                  <div
                     className={`flex items-center justify-between rounded-md ${
                        depth > 0
                           ? 'w-full px-2 py-3 text-s-800 hover:bg-gray-100'
                           : 'cursor-pointer px-2 py-2 text-white hover:bg-blue-3'
                     }`}
                  >
                     <span className='max-w-[200px] whitespace-normal break-words'>
                        {TRANSLATED_VALUES[locale].header?.[
                           item.title.toLowerCase()
                        ] || item.title}
                     </span>
                     <BiChevronDown
                        className={`ml-1 flex-shrink-0 text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
                     />
                  </div>
               </LocalizedLink>
               {isOpen && (
                  <div className='absolute left-0 top-full z-50 pt-2'>
                     <ul className='min-w-[300px] rounded-md border border-s-400 bg-white shadow-md'>
                        {item.children.map((child, index) => (
                           <DesktopMenuItem
                              key={index}
                              item={child}
                              depth={depth + 1}
                           />
                        ))}
                     </ul>
                  </div>
               )}
            </>
         ) : (
            <LocalizedLink
               href={item.url ?? ''}
               className={`block rounded-md px-2 py-2 ${
                  depth > 0
                     ? 'text-s-800 hover:bg-gray-100'
                     : 'text-white hover:bg-blue-3'
               }`}
               lang={locale}
            >
               <span className='whitespace-normal break-words'>
                  {TRANSLATED_VALUES[locale].header?.[
                     item.title.toLowerCase()
                  ] ||
                     TRANSLATED_VALUES[locale]?.services[item.title] ||
                     item.title}
               </span>
            </LocalizedLink>
         )}
      </li>
   );
};
