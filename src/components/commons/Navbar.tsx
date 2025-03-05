import React from 'react';
import { LocalizedLink } from './LocalizedLink';
import ClientSearchHero from '../Home/ClientSearchHero';
import { LOGO_URL_LIGHT } from '@/utils/constants';
import { Media } from '../StrapiImage/StrapiImage';
import HamburgerButtonClient from './HamburgerButtonClient';
import { DesktopMenuItem } from './MenuItemsClient';

// Import industry icons dynamically to reduce initial load
import dynamic from 'next/dynamic';

const MobileMenuClient = dynamic(() => import('./MobileMenuClient'));

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

const exclude = ['unknown', 'medical devices', 'pharmaceuticals'];

const Navbar: React.FC<INavbarProps> = ({ header, mainMenu, industries }) => {
   return (
      <div className='container'>
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
            <div className='flex items-center gap-2 sm:hidden'>
               <div className='max-w-[100px] [&>div]:mt-0 [&>div]:w-full [&>div]:py-1'>
                  <ClientSearchHero
                     placeholder='Search here...'
                     variant='light'
                     onlyIcon
                  />
               </div>
               <HamburgerButtonClient />
            </div>
            <ul className='hidden flex-wrap items-center gap-4 text-white sm:flex'>
               {mainMenu.map((item, index) =>
                  item.title?.toLowerCase()?.includes('industr') ? (
                     <a key={index} title='industries' href={item.url ?? ''}>
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
                  ) : (
                     <DesktopMenuItem key={index} item={item} depth={0} />
                  ),
               )}
            </ul>
            <div className='ml-4 hidden items-center sm:flex'>
               <div className='gtranslate_wrapper !relative'></div>
            </div>
         </nav>

         {/* Mobile Side Menu */}
         <MobileMenuClient
            mainMenu={mainMenu}
            industries={industries}
            header={header}
         />
      </div>
   );
};

export default Navbar;
