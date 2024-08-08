import { FC } from 'react';

import Navbar from './commons/Navbar';
import Topbar from './commons/Topbar';
import Header from './commons/Header';
import Footer from './commons/Footer';

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

const Appwrapper: FC<AppwrapperProps> = ({ children }) => {
   return (
      <>
         <Header key='header' />
         <main key='main'>{children}</main>
         <Footer key='footer' />
      </>
   );
};

export default Appwrapper;
