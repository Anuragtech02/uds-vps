import Navbar from './Navbar';
import Topbar from './Topbar';
import { Media } from '../StrapiImage/StrapiImage';
import HeaderStickyClient from './HeaderStickyClient';

interface IHeader {
   phoneNumber: string;
   email: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   logo?: Media;
   ctaButton: { id: number; title: string; link: string };
}

const Header = ({
   header,
   industries,
   mainMenu,
   pathname = '/',
}: {
   header: IHeader;
   industries: any;
   mainMenu: any;
   pathname: string;
}) => {
   const isReportsSlugPage =
      pathname.startsWith('/reports/') && !pathname.endsWith('/reports/');

   return (
      <>
         <div
            className={`${isReportsSlugPage ? 'relative' : 'fixed'} left-0 top-0 z-50 w-full border-b border-s-300 bg-white py-4`}
            key='header'
            id='main-header'
         >
            <Topbar header={header} />
            <Navbar
               header={header}
               mainMenu={mainMenu}
               industries={industries}
            />
            <HeaderStickyClient />
         </div>
      </>
   );
};

export default Header;
