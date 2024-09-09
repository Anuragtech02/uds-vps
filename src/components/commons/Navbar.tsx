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
}

const MobileMenuItem: React.FC<{ item: MenuItem; depth: number }> = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className={`w-full ${depth > 0 ? 'pl-4' : ''}`}>
      {item.children && item.children.length > 0 ? (
        <>
          <div
            className="flex w-full items-center justify-between px-4 py-2 text-white hover:bg-blue-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{item.title}</span>
            <BiChevronDown className={`ml-1 inline text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`} />
          </div>
          {isOpen && (
            <Link href={item.url}> 
               <ul className="w-full">
               {item.children.map((child, index) => (
                  <MobileMenuItem key={index} item={child} depth={depth + 1} />
                  ))}
               </ul>
            </Link>
          )}
        </>
      ) : (
        <Link href={item.url ?? ''} className="block w-full px-4 py-2 text-white hover:bg-blue-2">
          {item.title}
        </Link>
      )}
    </li>
  );
};

const DesktopMenuItem: React.FC<{ item: MenuItem; depth: number }> = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <li 
      className={`dropdown-menu relative ${depth > 0 ? 'w-full' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.children && item.children.length > 0 ? (
        <>
          <div className={`flex items-center justify-between rounded-md ${depth > 0 ? 'w-full px-4 py-2 hover:bg-gray-100' : 'cursor-pointer px-3 py-2 hover:bg-blue-3'}`}>
            <span>{item.title}</span>
            {depth === 0 ? 
              <BiChevronDown className={`ml-1 inline text-xl ${isOpen ? 'rotate-180' : ''} transition-transform`} /> :
              <BiChevronRight className="ml-1 inline text-xl" />
            }
          </div>
          {isOpen && (
            <div className={`absolute ${depth === 0 ? 'left-0 top-full' : 'left-full top-0'} min-w-[200px]`}>
              <div className={`${depth > 0 ? 'pl-2' : 'pt-2'}`}>
               <Link href={item.url}>
                  <ul className="rounded-md border border-s-400 bg-white font-medium text-s-800 shadow-md">
                     {item.children.map((child, index) => (
                        <DesktopMenuItem key={index} item={child} depth={depth + 1} />
                     ))}
                  </ul>
               </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <Link href={item.url ?? ''} className={`block w-full px-4 py-2 rounded-md ${depth > 0 ? 'hover:bg-gray-100' : 'hover:bg-blue-3'}`}>
          {item.title}
        </Link>
      )}
    </li>
  );
};

const Navbar: React.FC<INavbarProps> = ({ header, mainMenu }) => {
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
    <div className="container">
      <nav className="flex items-center justify-between rounded-md bg-blue-2 px-6 py-2 md:px-8">
        <Link href="/" className="flex items-center">
          <img
            src={header?.logo?.data?.attributes?.url}
            alt="logo"
            className="h-10 w-24 object-contain md:h-16 md:w-32"
          />
        </Link>
        {isMobile ? (
          <button title='open' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            <BiMenu size={24} />
          </button>
        ) : (
          <>
            <ul className="flex items-center space-x-1 text-white">
              {mainMenu.map((item, index) => (
                <DesktopMenuItem key={index} item={item} depth={0} />
              ))}
            </ul>
            <div className="flex items-center">
              <Link href={header?.ctaButton?.link ?? ''}>
                <Button>{header?.ctaButton?.title}</Button>
              </Link>
            </div>
          </>
        )}
      </nav>
      
      {/* Mobile Side Menu */}
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full w-64 bg-blue-2 shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end p-4">
            <button title="close" onClick={() => setIsMobileMenuOpen(false)}>
              <BiX size={24}  color='white'/>
            </button>
          </div>
          <ul className="mt-4">
            {mainMenu.map((item, index) => (
              <MobileMenuItem key={index} item={item} depth={0} />
            ))}
          </ul>
          <div className="mt-4 px-4">
            <Link href={header?.ctaButton?.link ?? ''}>
              <Button className="w-full">{header?.ctaButton?.title}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;