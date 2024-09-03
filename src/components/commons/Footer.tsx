'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/img/logo.png';
import earth from '@/assets/img/earth.png';
import Button from './Button';
import {
   FaInstagram,
   FaLinkedin,
   FaFacebook,
   FaTwitter,
} from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import CustomResearchCTA from './CustomResearchCTA';

const socials = [];
const invalidRoutes = ['/', '/about'];

const Footer = () => {
   const pathname = usePathname();
   return (
      <>
         {invalidRoutes.includes(pathname) ? null : (
            <div className='container py-10 md:py-16 md:pb-20'>
               <CustomResearchCTA />
            </div>
         )}
         <footer className='bg-blue-1 pb-12 text-white'>
            <div className='relative border-b border-blue-4 py-12 text-center'>
               <img
                  src={earth.src}
                  className='absolute inset-0 z-[1] h-full w-full object-cover'
                  alt=''
               />
               <div className='container relative z-[3]'>
                  <h1>
                     Order your <span className='text-white'>tailored</span>{' '}
                     research report now!
                  </h1>
                  <p className='mx-auto mt-4 text-s-300 md:w-2/3 md:text-2xl'>
                     Rorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Nunc vulputate libero et velit interdum, ac aliquet odio
                     mattis.
                  </p>
                  <Button variant='primary' className='mx-auto mt-10'>
                     Become our client
                  </Button>
               </div>
            </div>
            <div className='container mx-auto px-4'>
               <div className='grid grid-cols-1 gap-8 pt-12 text-blue-9 md:grid-cols-5'>
                  {/* Company Info */}
                  <div className='col-span-1 md:col-span-2'>
                     <Image
                        src={logo}
                        alt='UnivDatos'
                        width={150}
                        height={50}
                     />
                     <p className='mt-4 text-blue-9 md:w-2/3'>
                        UnivDatos Market Insights (UMI), a subsidiary of
                        Universal Data Solutions is a rapidly growing dynamic
                        market research firm led by a core of dedicated
                        professionals.
                     </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                     <p className='mb-4 text-lg text-white'>QUICK LINKS</p>
                     <ul className='space-y-2'>
                        {[
                           'Home',
                           'About',
                           'Report Store',
                           'Custom Research',
                           'Reading',
                           'Careers',
                           'Contact',
                        ].map((item) => (
                           <li key={item}>
                              <Link
                                 href={`/${item.toLowerCase().replace(' ', '-')}`}
                                 className='hover:text-gray-300'
                              >
                                 {item}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Industry Verticals */}
                  <div>
                     <p className='mb-4 text-lg text-white'>
                        INDUSTRY VERTICALS
                     </p>
                     <ul className='space-y-2'>
                        {[
                           'Automotive',
                           'Electrics & Semiconductor',
                           'Healthcare',
                           'Media & Entertainment',
                           'Telecom & IT',
                           'Consumer Goods',
                           'View All',
                        ].map((item) => (
                           <li key={item}>
                              <Link
                                 href={`/industry/${item.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                                 className='hover:text-gray-300'
                              >
                                 {item}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Contact */}
                  <div>
                     <p className='mb-4 text-lg text-white'>CONTACT</p>
                     <p className='mb-2'>+1 9782263411</p>
                     <p className='mb-4'>contact@univdatos.com</p>
                     <Button
                        variant='light'
                        className='border border-blue-9 !bg-blue-1 text-blue-9'
                     >
                        Send An Enquiry →
                     </Button>
                  </div>
               </div>

               {/* Copyright and Social Icons */}
               <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-700 pt-8 md:flex-row'>
                  <p>© Univdatos</p>
                  <div className='mt-4 flex space-x-4 md:mt-0'>
                     <a
                        href={`https://facebook.com`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaFacebook key='FaFacebook' />
                     </a>
                     <a
                        href={`https://twitter.com`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaTwitter key='FaTwitter' />
                     </a>
                     <a
                        href={`https://linkedin.com`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaLinkedin key='FaLinkedin' />
                     </a>
                     <a
                        href={`https://instagram.com`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaInstagram key='FaInstagram' />
                     </a>
                  </div>
               </div>
            </div>
         </footer>
      </>
   );
};

export default Footer;
