import { FC, Suspense } from 'react';

import Navbar from './commons/Navbar';
import Topbar from './commons/Topbar';
import Header from './commons/Header';
import Footer from './commons/Footer';
import {
   getFooter,
   getFooterQuickLinks,
   getHeader,
   getHeaderMainMenu,
   getIndustries,
} from '@/utils/api/services';
import SearchWrapper from './Search/SearchWrapper';
import PageSwitchLoading from './PageSwitchLoading';

interface AppwrapperProps {
   children: React.ReactNode;
}

export const variants = {
   out: {
      opacity: 0,
      transition: {
         duration: 0.333,
      },
   },
   in: {
      opacity: 1,
      scale: 1,

      transition: {
         duration: 0.2,
         delay: 0.05,
      },
   },
};

export interface MenuItemData {
   id: number | string;
   attributes: {
      [key: string]: any;
      children?: {
         data: MenuItemData[];
      };
   };
}

export interface MenuItem {
   id: number | string;
   [key: string]: any;
   children?: MenuItem[];
}

const mapMenuItem = (item: MenuItemData): MenuItem => ({
   id: item.id,
   ...item.attributes,
   children: item.attributes.children?.data?.map(mapMenuItem) || [],
});

export const mapHeaderMainMenu = (headerMainMenuData: any): MenuItem[] => {
   return (
      headerMainMenuData?.data?.attributes?.items?.data?.map(mapMenuItem) || []
   );
};

export const mapFooterQuickLinks = (footerQuickLinksData: any): MenuItem[] => {
   return (
      footerQuickLinksData?.data?.attributes?.items?.data?.map(mapMenuItem) ||
      []
   );
};

const Appwrapper: FC<AppwrapperProps> = async ({ children }) => {
   let footerData,
      headerData,
      industriesData,
      headerMainMenuData,
      footerQuickLinksData;
   try {
      [
         headerData,
         footerData,
         industriesData,
         headerMainMenuData,
         footerQuickLinksData,
      ] = await Promise.all([
         getHeader(),
         getFooter(),
         getIndustries(),
         getHeaderMainMenu(),
         getFooterQuickLinks(),
      ]);
   } catch (err) {
      console.error(err);
   }
   let header = headerData?.data?.attributes;
   let footer = footerData?.data?.attributes;
   let industries = industriesData?.data?.map(
      (industry: any) => industry.attributes,
   );
   let headerMainMenu = mapHeaderMainMenu(headerMainMenuData);
   let footerQuickLinks = mapFooterQuickLinks(footerQuickLinksData);

   return (
      <>
         <Header
            key='header'
            header={header}
            industries={industries}
            mainMenu={headerMainMenu}
         />
         <Suspense fallback={<PageSwitchLoading />}>
            <main key='main' className='lg:min-h-[100svh]'>
               {children}
            </main>
         </Suspense>
         <SearchWrapper />
         <Footer
            key='footer'
            footer={footer}
            industries={industries}
            quickLinks={footerQuickLinks}
         />
      </>
   );
};

export default Appwrapper;
