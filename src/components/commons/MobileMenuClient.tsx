'use client';
import React, { useState } from 'react';
import { LocalizedLink } from './LocalizedLink';
import Button from './Button';

// Import industry icons dynamically to reduce initial load
import dynamic from 'next/dynamic';
import { BiChevronDown, BiX } from 'react-icons/bi';
import { Media } from '../StrapiImage/StrapiImage';
import { useMenuStore } from '@/stores/menu.store';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';

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

interface Props {
   mainMenu: MenuItem[];
   industries: any[];
   header: {
      phoneNumber: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      logo?: Media;
      ctaButton: { id: number; title: string; link: string };
   };
}

interface MenuItem {
   title: string;
   url: string;
   children?: MenuItem[];
}

const MobileMenuItem: React.FC<{
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
                  <span className='break-words pr-2'>
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
            >
               {depth > 0 && item.url?.includes('industries=') && (
                  <div className='mr-2'>
                     {industryIcons[
                        item.url.split('industries=')[1]?.split('&')[0]
                     ] || <IconPlaceholder />}
                  </div>
               )}
               <span className='break-words'>
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

const exclude = ['unknown', 'medical devices', 'pharmaceuticals'];

const MobileMenuClient: React.FC<Props> = ({
   mainMenu,
   industries,
   header,
}) => {
   const { isMobileMenuOpen, setIsMobileMenuOpen } = useMenuStore();
   const { locale } = useLocale();
   return (
      <div
         className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
         style={{ opacity: isMobileMenuOpen ? 1 : 0 }}
      >
         <div
            className={`pointer-events-auto absolute right-0 top-0 h-full w-full bg-blue-2 shadow-lg transition-transform duration-300 ease-in-out sm:w-[300px] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
         >
            <div className='flex h-[50px] justify-end p-4'>
               <button title='close' onClick={() => setIsMobileMenuOpen(false)}>
                  <BiX size={24} color='white' />
               </button>
            </div>
            <ul className='max-h-[calc(100%-50px-70px)] overflow-y-auto'>
               {mainMenu.map((item, index) =>
                  item.title?.toLowerCase()?.includes('industr') ? (
                     <MobileMenuItem
                        key={index}
                        item={{
                           ...item,
                           children: industries
                              .filter(
                                 (industry) =>
                                    !exclude.includes(
                                       industry.name.toLowerCase(),
                                    ),
                              )
                              .map(({ slug, name }) => ({
                                 title: TRANSLATED_VALUES[locale]?.industries?.[
                                    name
                                 ],
                                 url: `/reports?industries=${slug}&page=1`,
                              })),
                        }}
                        depth={0}
                        onClick={() => setIsMobileMenuOpen(false)}
                     />
                  ) : (
                     <MobileMenuItem
                        key={index}
                        item={item}
                        depth={0}
                        onClick={() => setIsMobileMenuOpen(false)}
                     />
                  ),
               )}
            </ul>
            <div className='sticky bottom-0 mt-4 h-[70px] bg-blue-2 px-2'>
               <LocalizedLink href={header?.ctaButton?.link ?? ''}>
                  <Button className='w-full'>{header?.ctaButton?.title}</Button>
               </LocalizedLink>
            </div>
         </div>
      </div>
   );
};

export default MobileMenuClient;
