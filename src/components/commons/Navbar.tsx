'use client';
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { BiChevronDown, BiMenu, BiX } from 'react-icons/bi';
import { LocalizedLink } from './LocalizedLink';
import ClientSearchHero from '../Home/ClientSearchHero';
import { LOGO_URL_LIGHT } from '@/utils/constants';
import { Media } from '../StrapiImage/StrapiImage';

// Import industry icons dynamically to reduce initial load
import dynamic from 'next/dynamic';

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

interface INavbarProps {
   header: {
      phoneNumber: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      logo?: Media;
      ctaButton: { id: number; title: string; link: string };
   };
   mainMenu: MenuItem[];
   industries: Array<{
      slug: string;
      name: string;
   }>;
}

const MobileMenuItem: React.FC<{
   item: MenuItem;
   depth: number;
   onClick: () => void;
}> = ({ item, depth, onClick }) => {
   const [isOpen, setIsOpen] = useState(false);

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

const DesktopMenuItem: React.FC<{ item: MenuItem; depth: number }> = ({
   item,
   depth,
}) => {
   const [isOpen, setIsOpen] = useState(false);

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
                  {item.title}
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
                              <span className='-mt-1'>{child.title}</span>
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
               <LocalizedLink href={item.url ?? ''}>
                  <div
                     className={`flex items-center justify-between rounded-md ${
                        depth > 0
                           ? 'w-full px-2 py-3 text-s-800 hover:bg-gray-100'
                           : 'cursor-pointer px-2 py-2 text-white hover:bg-blue-3'
                     }`}
                  >
                     <span className='max-w-[200px] whitespace-normal break-words'>
                        {item.title}
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
            >
               <span className='whitespace-normal break-words'>
                  {item.title}
               </span>
            </LocalizedLink>
         )}
      </li>
   );
};

const exclude = ['unknown', 'medical devices', 'pharmaceuticals'];

const Navbar: React.FC<INavbarProps> = ({ header, mainMenu, industries }) => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      // Fix FOUC by waiting a bit for styles to load
      const timer = setTimeout(() => {
         setIsLoaded(true);
      }, 100);

      const handleResize = () => {
         setIsMobile(window.innerWidth < 1024);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
         clearTimeout(timer);
      };
   }, []);

   return (
      <div
         className={`container ${!isLoaded ? 'mobile-nav-loading' : 'mobile-nav-loaded'}`}
      >
         <nav className='flex items-center justify-between rounded-md bg-blue-1 px-2 py-2 lg:px-8'>
            <LocalizedLink href='/' className='flex items-center lg:hidden'>
               <img
                  src={LOGO_URL_LIGHT}
                  alt='logo'
                  fetchPriority='high'
                  className='h-10 w-24 object-contain md:h-16 md:w-32'
                  width={128}
                  height={64}
               />
            </LocalizedLink>
            {isMobile ? (
               <div className='flex items-center gap-2'>
                  <div className='max-w-[100px] [&>div]:mt-0 [&>div]:w-full [&>div]:py-1'>
                     <ClientSearchHero
                        placeholder='Search here...'
                        variant='light'
                        onlyIcon
                     />
                  </div>
                  <button
                     title='open'
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     className='text-white'
                  >
                     <BiMenu size={24} />
                  </button>
               </div>
            ) : (
               <>
                  <ul className='flex flex-wrap items-center gap-4 text-white'>
                     {mainMenu.map((item, index) =>
                        item.title?.toLowerCase()?.includes('industr') ? (
                           <li key={index}>
                              <a title='industries' href={item.url ?? ''}>
                                 <DesktopMenuItem
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
                                             title: name,
                                             url: `/reports?industries=${slug}&page=1`,
                                          })),
                                    }}
                                    depth={0}
                                 />
                              </a>
                           </li>
                        ) : (
                           <DesktopMenuItem key={index} item={item} depth={0} />
                        ),
                     )}
                  </ul>
                  <div className='ml-4 flex items-center'>
                     <div className='gtranslate_wrapper !relative'></div>
                  </div>
               </>
            )}
         </nav>

         {/* Mobile Side Menu */}
         <div
            className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
            style={{ opacity: isMobileMenuOpen ? 1 : 0 }}
         >
            <div
               className={`pointer-events-auto absolute right-0 top-0 h-full w-full bg-blue-2 shadow-lg transition-transform duration-300 ease-in-out sm:w-[300px] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
               <div className='flex h-[50px] justify-end p-4'>
                  <button
                     title='close'
                     onClick={() => setIsMobileMenuOpen(false)}
                  >
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
                                    title: name,
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
                     <Button className='w-full'>
                        {header?.ctaButton?.title}
                     </Button>
                  </LocalizedLink>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Navbar;
