'use client';
import Image from 'next/image';
import earth from '@/assets/img/earth-min.png';
import Button from './Button';
import {
   FaInstagram,
   FaLinkedin,
   FaFacebook,
   FaXTwitter,
} from 'react-icons/fa6';
import { LocalizedLink } from './LocalizedLink';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import Popup from '../Popup';
import DemoRequestForm from '../Home/DemoRequestForm';
import { FaPinterest, FaYoutube } from 'react-icons/fa';
import StrapiImage from '../StrapiImage/StrapiImage';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';
import GetACallbackButton from './GetACallbackButton';

const LOGO_DIMENSIONS = { width: 150, height: 50 };
const EARTH_DIMENSIONS = { width: 1920, height: 1080 };

const Footer = ({ footer, quickLinks }: any) => {
   const { locale } = useLocale();
   return (
      <>
         {/* {invalidRoutes.includes(pathname) ? null : (
            <div className='container py-10 md:py-16 md:pb-20'>
               <CustomResearchCTA  />
            </div>
         )} */}
         <footer className='bg-blue-1 pb-12 text-white [&>a]:hover:underline'>
            <div className='relative h-[300px] overflow-hidden border-b border-blue-4 py-12 text-center md:h-[350px] xl:h-[300px]'>
               <div className='absolute inset-0 bottom-0 z-[1] h-full w-full'>
                  <Image
                     src={earth}
                     alt='Earth background'
                     className='object-cover'
                     sizes='100vw'
                     {...EARTH_DIMENSIONS}
                  />
               </div>
               <div className='container relative z-[3]'>
                  <div className='min-h-[60px]'>
                     <p
                        className='text-[2.25rem] font-bold md:text-[3rem]'
                        dangerouslySetInnerHTML={{
                           __html:
                              TRANSLATED_VALUES[locale]?.footer?.[
                                 footer?.footerCTA?.title
                              ],
                        }}
                     ></p>
                  </div>
                  {footer?.footerCTA?.description?.trim()?.length > 0 && (
                     <p className='mx-auto mt-4 text-s-300 md:w-2/3 md:text-2xl'>
                        {footer?.footerCTA?.description}
                     </p>
                  )}
                  <LocalizedLink
                     href={footer?.footerCTA?.ctaButton?.link ?? '/contact'}
                     lang={locale}
                  >
                     <Button variant='primary' className='mx-auto mt-10'>
                        {
                           TRANSLATED_VALUES[locale]?.footer?.[
                              footer?.footerCTA?.ctaButton?.title
                           ]
                        }
                     </Button>
                  </LocalizedLink>
               </div>
            </div>
            <div className='container mx-auto px-4'>
               <div className='grid grid-cols-1 gap-4 pt-12 text-blue-9 sm:gap-8 md:grid-cols-5'>
                  {/* Company Info */}
                  <div className='col-span-1 md:col-span-2'>
                     <LocalizedLink href='/' lang={locale}>
                        <div className='h-[50px] w-[150px]'>
                           <StrapiImage
                              media={footer?.companyInfo?.logo}
                              size='small'
                              alt='UnivDatos'
                              unoptimized
                              {...LOGO_DIMENSIONS}
                           />
                        </div>
                     </LocalizedLink>
                     <p className='mt-4 text-blue-9 md:w-2/3'>
                        {
                           TRANSLATED_VALUES[locale]?.footer?.[
                              footer?.companyInfo?.companyDescription
                           ]
                        }
                     </p>
                     <div className='mt-4 flex space-x-4 md:mt-8'>
                        <a
                           title='Facebook'
                           href={`https://www.facebook.com/univdatosmarketinsights/`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaFacebook key='FaFacebook' />
                        </a>
                        <a
                           title='Twitter'
                           href={`https://x.com/univ_datos`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaXTwitter key='FaTwitter' />
                        </a>
                        <a
                           title='LinkedIn'
                           href={`https://www.linkedin.com/company/univ-datos-market-insight/`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaLinkedin key='FaLinkedin' />
                        </a>
                        <a
                           title='Instagram'
                           href={`https://www.instagram.com/univdatosmarketinsights/?hl=en`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaInstagram key='FaInstagram' />
                        </a>
                        <a
                           title='Youtube'
                           href={`https://www.youtube.com/@univdatosmarketinsights1114`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaYoutube key='FaYoutube' />
                        </a>
                        <a
                           title='Pinterest'
                           href={`https://in.pinterest.com/univdatosmarketinsights/`}
                           target='_blank'
                           rel='noopener noreferrer'
                           className='text-3xl text-white hover:text-gray-300'
                        >
                           <FaPinterest key='FaPinterest' />
                        </a>
                     </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                     <p className='mb-4 text-lg text-white'>
                        {TRANSLATED_VALUES[locale]?.footer?.quickLinks}
                     </p>
                     <ul className='space-y-2'>
                        {quickLinks?.map((item: any) => (
                           <li key={item?.title}>
                              <LocalizedLink
                                 href={item?.url ?? ''}
                                 className='hover:text-gray-300 hover:underline'
                                 lang={locale}
                              >
                                 {TRANSLATED_VALUES[locale]?.footer?.[
                                    item?.title
                                 ] || item?.title}
                              </LocalizedLink>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Industry Verticals */}
                  <div>
                     <p className='mb-4 text-lg text-white'>
                        {TRANSLATED_VALUES[locale]?.footer?.industryVerticals}
                     </p>
                     <ul className='space-y-2'>
                        {footer?.industries?.map((item: any) => (
                           <li key={item?.slug}>
                              <LocalizedLink
                                 href={`/reports?industries=${item?.slug}`}
                                 className='hover:text-gray-300 hover:underline'
                                 lang={locale}
                              >
                                 {
                                    TRANSLATED_VALUES[locale]?.industries?.[
                                       item?.name
                                    ]
                                 }
                              </LocalizedLink>
                           </li>
                        ))}
                        <li>
                           <LocalizedLink
                              href='/reports'
                              className='hover:text-gray-300 hover:underline'
                              lang={locale}
                           >
                              {TRANSLATED_VALUES[locale]?.footer?.viewAll}
                           </LocalizedLink>
                        </li>
                     </ul>
                  </div>

                  {/* Contact */}
                  <div>
                     <p className='mb-4 text-lg text-white'>
                        {TRANSLATED_VALUES[locale]?.footer?.contact}
                     </p>
                     <p className='mb-2'>
                        C-80B, Sector 8, Noida, Uttar Pradesh- 201301, India
                     </p>
                     <a
                        href={`tel:${footer?.phoneNumber?.replace(/ /g, '')}`}
                        className='notranslate mb-2 block'
                     >
                        {footer?.phoneNumber}
                     </a>
                     <a
                        href={`mailto:${footer?.email}`}
                        className='notranslate mb-4 block max-w-[200px] break-words'
                     >
                        {footer?.email}
                     </a>
                     <GetACallbackButton />
                  </div>
               </div>

               {/* Copyright and Social Icons */}
               <div className='mt-12 flex flex-col items-center justify-start border-t border-gray-700 pt-8 md:flex-row'>
                  <p>{footer?.copyRightText}</p>
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
            <Popup
               name='demo-request'
               title={TRANSLATED_VALUES[locale]?.contact?.requestADemo}
            >
               <DemoRequestForm />
            </Popup>
         </Suspense>
      </>
   );
};

export default Footer;
