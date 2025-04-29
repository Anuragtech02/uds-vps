import { FC, Suspense } from 'react';

import Header from './commons/Header';
import Footer from './commons/Footer';
import { getRootConfig } from '@/utils/api/services';
import PageSwitchLoading from './PageSwitchLoading';
import dynamic from 'next/dynamic';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utils/constants';

const SearchWrapper = dynamic(() => import('./Search/SearchWrapper'));

interface AppwrapperProps {
   children: React.ReactNode;
   pathname: string;
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
   [key: string]: any;
   children?: {
      data: MenuItemData[];
   };
}

export interface MenuItem {
   id: number | string;
   [key: string]: any;
   children?: MenuItem[];
}

// Helper function to organize items into a tree structure
const organizeItemsIntoTree = (items: any[]): MenuItem[] => {
   const itemsMap = new Map();
   const rootItems: MenuItem[] = [];

   // First pass: Create a map of all items
   items.forEach((item) => {
      itemsMap.set(item.id, {
         id: item.id,
         title: item.title,
         url: item.url,
         target: item.target,
         order: item.order,
         children: [],
      });
   });

   // Second pass: Organize into tree structure
   items.forEach((item) => {
      const mappedItem = itemsMap.get(item.id);
      if (item.parent) {
         const parentItem = itemsMap.get(item.parent.id);
         if (parentItem) {
            parentItem.children.push(mappedItem);
         }
      } else {
         rootItems.push(mappedItem);
      }
   });

   // Sort items by order
   const sortByOrder = (items: MenuItem[]) => {
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      items.forEach((item) => {
         if (item.children && item.children.length > 0) {
            sortByOrder(item.children);
         }
      });
      return items;
   };

   return sortByOrder(rootItems);
};

const mapMenuItem = (item: any): MenuItem => ({
   id: item.id,
   title: item.attributes.title,
   url: item.attributes.url,
   children: item.attributes.children?.map(mapMenuItem) || [],
});

export const mapHeaderMainMenu = (headerMainMenuData: any): MenuItem[] => {
   const items = headerMainMenuData?.data?.attributes?.items?.data || [];
   return items.map(mapMenuItem);
};

export const mapFooterQuickLinks = (footerQuickLinksData: any): MenuItem[] => {
   const items = footerQuickLinksData?.data?.attributes?.items?.data || [];
   return items.map(mapMenuItem);
};

const Appwrapper: FC<AppwrapperProps> = async ({ children, pathname }) => {
   let globalData;
   try {
      const response = await getRootConfig();
      globalData = response;
   } catch (err) {
      console.error(err);
   }

   const { header, footer, industries, headerMainMenu, footerQuickLinks } =
      globalData || {};

   const mappedHeaderMenu = mapHeaderMainMenu(headerMainMenu);
   const mappedFooterLinks = mapFooterQuickLinks(footerQuickLinks);

   // console.log(`Appwrapper rendering with pathname: ${pathname}`);

   return (
      <>
         <Header
            key='header'
            header={header}
            industries={industries}
            mainMenu={mappedHeaderMenu}
            pathname={pathname}
         />
         <Suspense fallback={<PageSwitchLoading />}>
            <main key='main' className='lg:min-h-screen-vh'>
               {children}
            </main>
         </Suspense>
         <SearchWrapper />
         <Footer key='footer' footer={footer} quickLinks={mappedFooterLinks} />
      </>
   );
};

export default Appwrapper;
