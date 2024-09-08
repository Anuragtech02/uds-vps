import { FC } from 'react';

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
   let headerMainMenu = headerMainMenuData?.data?.attributes?.items?.data?.map(
      (item: any) => ({
         id: item?.id,
         ...item?.attributes,
         children: item?.attributes?.children?.data?.map((child: any) => ({
            id: child?.id,
            ...child?.attributes,
         })),
      }),
   );
   let footerQuickLinks =
      footerQuickLinksData?.data?.attributes?.items?.data?.map((item: any) => ({
         id: item?.id,
         ...item?.attributes,
      }));

   return (
      <>
         <Header
            key='header'
            header={header}
            industries={industries}
            mainMenu={headerMainMenu}
         />
         <main key='main'>{children}</main>
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
