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
import { LocalizedLink } from './LocalizedLink';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import Popup from '../Popup';
import DemoRequestForm from '../Home/DemoRequestForm';

const socials = [];
const invalidRoutes = [
   '/',
   '/about',
   '/contact',
   '/login',
   '/signup',
   '/search',
];

const Footer = ({ footer, quickLinks }: any) => {
   const pathname = usePathname();

   return (
      <>
         {/* {invalidRoutes.includes(pathname) ? null : (
            <div className='container py-10 md:py-16 md:pb-20'>
               <CustomResearchCTA  />
            </div>
         )} */}
         <footer className='bg-blue-1 pb-12 text-white [&>a]:hover:underline'>
            <div className='relative border-b border-blue-4 py-12 text-center'>
               <img
                  src={earth.src}
                  className='absolute inset-0 z-[1] h-full w-full object-cover'
                  alt=''
               />
               <div className='container relative z-[3]'>
                  <p
                     className='text-[2.25rem] font-bold md:text-[3.5rem]'
                     dangerouslySetInnerHTML={{
                        __html: footer?.footerCTA?.title,
                     }}
                  >
                     {/* Order your <span className='text-white'>tailored</span>{' '}
                     research report now! */}
                  </p>
                  <p className='mx-auto mt-4 text-s-300 md:w-2/3 md:text-2xl'>
                     {footer?.footerCTA?.description}
                  </p>
                  <LocalizedLink
                     href={footer?.footerCTA?.ctaButton?.link ?? '/contact'}
                  >
                     <Button variant='primary' className='mx-auto mt-10'>
                        {footer?.footerCTA?.ctaButton?.title}
                     </Button>
                  </LocalizedLink>
               </div>
            </div>
            <div className='container mx-auto px-4'>
               <div className='grid grid-cols-1 gap-8 pt-12 text-blue-9 md:grid-cols-5'>
                  {/* Company Info */}
                  <div className='col-span-1 md:col-span-2'>
                     <Image
                        src={footer?.companyInfo?.logo?.data?.attributes?.url}
                        alt='UnivDatos'
                        width={150}
                        height={50}
                     />
                     <p className='mt-4 text-blue-9 md:w-2/3'>
                        {footer?.companyInfo?.companyDescription}
                     </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                     <p className='mb-4 text-lg text-white'>QUICK LINKS</p>
                     <ul className='space-y-2'>
                        {quickLinks?.map((item: any) => (
                           <li key={item}>
                              <LocalizedLink
                                 href={item?.url ?? ''}
                                 className='hover:text-gray-300 hover:underline'
                              >
                                 {item?.title}
                              </LocalizedLink>
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
                        {footer.industries?.data?.map((item: any) => (
                           <li key={item?.attributes?.slug}>
                              <LocalizedLink
                                 href={`/reports?industries=${item?.attributes?.slug}`}
                                 className='hover:text-gray-300 hover:underline'
                              >
                                 {item?.attributes?.name}
                              </LocalizedLink>
                           </li>
                        ))}
                        <li>
                           <LocalizedLink
                              href='/reports'
                              className='hover:text-gray-300 hover:underline'
                           >
                              View All
                           </LocalizedLink>
                        </li>
                     </ul>
                  </div>

                  {/* Contact */}
                  <div>
                     <p className='mb-4 text-lg text-white'>CONTACT</p>
                     <p className='mb-2'>{footer?.phoneNumber}</p>
                     <p className='mb-4'>{footer?.email}</p>
                     <p className='mb-4'>4th & 5th Floor, C80B, Sector 8, Noida, Uttar Pradesh- 201301, India</p>
                     <LocalizedLink href='?popup=demo-request'>
                        <Button
                           variant='light'
                           className='border border-blue-9 !bg-blue-1 text-blue-9'
                        >
                           Send An Enquiry →
                        </Button>
                     </LocalizedLink>
                  </div>
               </div>

               {/* Copyright and Social Icons */}
               <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-700 pt-8 md:flex-row'>
                  <p>{footer?.copyRightText}</p>
                  <div className='mt-4 flex space-x-4 md:mt-0'>
                     <a
                        href={`https://www.facebook.com/univdatosmarketinsights/`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaFacebook key='FaFacebook' />
                     </a>
                     <a
                        href={`https://x.com/iuniv_datos`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaTwitter key='FaTwitter' />
                     </a>
                     <a
                        href={`https://www.linkedin.com/company/univ-datos-market-insight/`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-gray-300'
                     >
                        <FaLinkedin key='FaLinkedin' />
                     </a>
                     <a
                        href={`https://www.instagram.com/univdatosmarketinsights/?hl=en`}
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
         <Suspense
            fallback={
               <div className='flex h-32 items-center justify-center'>
                  <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
               </div>
            }
         >
            <Popup name='demo-request' title='Request a Demo'>
               <DemoRequestForm />
            </Popup>
         </Suspense>
      </>
   );
};

export default Footer;
