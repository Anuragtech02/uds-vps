import { FC } from 'react';

import Navbar from './commons/Navbar';
import Topbar from './commons/Topbar';
import Header from './commons/Header';
import Footer from './commons/Footer';
import { getFooter, getHeader, getIndustries } from '@/utils/api/services';

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
   let footerData, headerData, industriesData;
   try {
      [headerData, footerData, industriesData] = await Promise.all([
         getHeader(),
         getFooter(),
         getIndustries(),
      ]);
   } catch (err) {
      console.error(err);
   }
   let header = headerData?.data?.attributes;
   let footer = footerData?.data?.attributes;
   let industries = industriesData?.data?.map(
      (industry: any) => industry.attributes,
   );

   return (
      <>
         <Header key='header' header={header} industries={industries} />
         <main key='main'>{children}</main>
         <Footer key='footer' footer={footer} industries={industries} />
      </>
   );
};

export default Appwrapper;
