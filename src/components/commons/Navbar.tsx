import React, { useState, useEffect } from 'react';
import Button from './Button';
import Link from 'next/link';
import { BiChevronDown, BiChevronRight, BiMenu, BiX } from 'react-icons/bi';

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
      logo?: { data: { attributes: { url?: string } } };
      ctaButton: { id: number; title: string; link: string };
   };
   mainMenu: MenuItem[];
   industries: Array<{
      slug: string;
      name: string;
   }>;
}

const MobileMenuItem: React.FC<{ item: MenuItem; depth: number }> = ({
   item,
   depth,
}) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <li className={`w-full ${depth > 0 ? 'pl-4' : ''}`}>
         {item.children && item.children.length > 0 ? (
            <>
               <div
                  className='flex w-full items-center justify-between px-4 py-2 text-white hover:bg-blue-2'
                  onClick={() => setIsOpen(!isOpen)}
               >
                  <span>{item.title}</span>
                  <BiChevronDown
                     className={`ml-1 inline text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
                  />
               </div>
               {isOpen && (
                  <Link href={item.url}>
                     <ul className='w-full'>
                        {item.children.map((child, index) => (
                           <MobileMenuItem
                              key={index}
                              item={child}
                              depth={depth + 1}
                           />
                        ))}
                     </ul>
                  </Link>
               )}
            </>
         ) : (
            <Link
               href={item.url ?? ''}
               className='block w-full px-4 py-2 text-white hover:bg-blue-2'
            >
               {item.title}
            </Link>
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
            <div className='flex cursor-pointer items-center px-3 py-2 hover:bg-blue-3'>
               <span>{item.title}</span>
               <BiChevronDown
                  className={`ml-1 inline text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
               />
            </div>
            {isOpen && (
               <div className='absolute left-0 top-full pt-2'>
                  <div className='rounded-md border border-s-400 bg-white p-6 shadow-md'>
                     <div className='grid min-w-[600px] grid-cols-2 gap-x-16 gap-y-2'>
                        {item.children?.map((child, index) => (
                           <Link
                              key={index}
                              href={child.url ?? ''}
                              className='whitespace-nowrap text-s-800 hover:text-blue-600'
                           >
                              {child.title}
                           </Link>
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
               <Link href={item.url ?? ''}>
                  <div
                     className={`flex items-center justify-between rounded-md ${
                        depth > 0
                           ? 'w-full px-4 py-2 hover:bg-gray-100'
                           : 'cursor-pointer px-3 py-2 hover:bg-blue-3'
                     }`}
                  >
                     <span>{item.title}</span>
                     <BiChevronDown
                        className={`ml-1 inline text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`}
                     />
                  </div>
               </Link>
               {isOpen && (
                  <div className='absolute left-0 top-full pt-2'>
                     <ul className='rounded-md border border-s-400 bg-white shadow-md'>
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
            <Link
               href={item.url ?? ''}
               className={`block rounded-md px-4 py-2 ${
                  depth > 0 ? 'hover:bg-gray-100' : 'hover:bg-blue-3'
               }`}
            >
               {item.title}
            </Link>
         )}
      </li>
   );
};

const Navbar: React.FC<INavbarProps> = ({ header, mainMenu, industries }) => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth < 1024); // Changed to 1024px
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return (
      <div className='container'>
         <nav className='flex items-center justify-between rounded-md bg-blue-2 px-6 py-2 md:px-8'>
            <Link href='/' className='flex items-center'>
               <img
                  src={header?.logo?.data?.attributes?.url}
                  alt='logo'
                  className='h-10 w-24 object-contain md:h-16 md:w-32'
               />
            </Link>
            {isMobile ? (
               <button
                  title='open'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='text-white'
               >
                  <BiMenu size={24} />
               </button>
            ) : (
               <>
                  <ul className='flex items-center space-x-1 text-white'>
                     {mainMenu.map((item, index) =>
                        item.title?.toLowerCase()?.includes('industr') ? (
                           <DesktopMenuItem
                              key={index}
                              item={{
                                 ...item,
                                 children: industries.map(({ slug, name }) => ({
                                    title: name,
                                    url: `/reports?industries=${slug}&page=1`,
                                 })),
                              }}
                              depth={0}
                           />
                        ) : (
                           <DesktopMenuItem key={index} item={item} depth={0} />
                        ),
                     )}
                  </ul>
                  <div className='flex items-center'>
                     <Link href={header?.ctaButton?.link ?? ''}>
                        <Button>{header?.ctaButton?.title}</Button>
                     </Link>
                  </div>
               </>
            )}
         </nav>

         {/* Mobile Side Menu */}
         <div
            className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
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
                              children: industries.map(({ slug, name }) => ({
                                 title: name,
                                 url: `/reports?industries=${slug}&page=1`,
                              })),
                           }}
                           depth={0}
                        />
                     ) : (
                        <MobileMenuItem key={index} item={item} depth={0} />
                     ),
                  )}
               </ul>
               <div className='mt-4 h-[70px] px-4'>
                  <Link href={header?.ctaButton?.link ?? ''}>
                     <Button className='w-full'>
                        {header?.ctaButton?.title}
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Navbar;
