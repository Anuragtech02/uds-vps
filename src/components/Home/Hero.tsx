import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import Ellipse from '../commons/Ellipse';
import { IoIosSearch } from 'react-icons/io';
import Image from 'next/image';
import heroImage from '@/assets/img/heroStock.jpg';
import TypewritterText from '../TypewritterText';
import Stats from '../commons/Stats';
import Link from 'next/link';
import StrapiImage from '../StrapiImage/StrapiImage';
import ClientSearchHero from './ClientSearchHero';
import Popup from '../Popup';
import DemoRequestForm from './DemoRequestForm';
import reportIllustration from '@/assets/img/report.svg';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { LocalizedLink } from '../commons/LocalizedLink';

const Hero: React.FC<{ data: any }> = ({ data }) => {
   const heroSection = {
      heroMainHeading: data.data.attributes.heroMainHeading,
      heroSearchPlaceholder: data.data.attributes.heroSearchPlaceholder,
      heroPrimaryCTA: {
         title: data.data.attributes.heroPrimaryCTA.title,
         link: data.data.attributes.heroPrimaryCTA.link,
      },
      heroSecondaryCTA: {
         title: data.data.attributes.heroSecondaryCTA.title,
         link: data.data.attributes.heroSecondaryCTA.link,
      },
      heroImage: data.data.attributes.heroImage.data.attributes,
      animationIndustriesList:
         data.data.attributes.animationIndustriesList.data.map(
            (item: any) => item.attributes.name,
         ),
   };

   const stats = data.data.attributes.statisticsCards.map((stat: any) => ({
      title: stat.title,
      countFrom: stat.countFrom,
      countTo: stat.countTo,
      icon: stat.icon.data.attributes,
   }));

   function getHeadingTextSplit() {
      const splitted = heroSection.heroMainHeading.split('<DYNAMIC>');
      return {
         first: splitted[0],
         second: splitted[1],
      };
   }

   return (
      <section className='relative bg-white pt-16 md:pt-20'>
         <div className='container'>
            <div className='flex flex-col-reverse items-center gap-6 py-16 md:flex-row md:py-32'>
               <div className='md:w-[60%]'>
                  <h1>
                     {getHeadingTextSplit().first}
                     <TypewritterText
                        markets={heroSection.animationIndustriesList}
                     />{' '}
                     <br /> {getHeadingTextSplit().second}
                  </h1>
                  <ClientSearchHero />

                  <div className='mt-4 flex flex-col gap-2 py-4 md:mt-10 lg:flex-row lg:items-center'>
                     <LocalizedLink href={heroSection.heroPrimaryCTA.link}>
                        <Button
                           className='w-full lg:w-auto'
                           size='large'
                           variant='secondary'
                           icon={<FaArrowRightLong />}
                        >
                           {heroSection.heroPrimaryCTA.title}
                        </Button>
                     </LocalizedLink>
                     <LocalizedLink href={heroSection.heroSecondaryCTA.link}>
                        <Button
                           className='w-full lg:w-auto'
                           size='large'
                           variant='light'
                           icon={<FaArrowRightLong />}
                        >
                           {heroSection.heroSecondaryCTA.title}
                        </Button>
                     </LocalizedLink>
                  </div>
               </div>
               <div className='relative w-full md:w-[40%]'>
                  <img
                     src={reportIllustration.src}
                     className='absolute bottom-0 right-[60%] z-[5] aspect-[2/3] w-[150px] sm:w-[180px] md:-bottom-12 md:block md:w-[150px] lg:-bottom-20 lg:right-[70%] xl:w-[240px]'
                     alt=''
                  />

                  <div className='relative mx-auto aspect-square w-[80%] overflow-hidden rounded-xl pb-10 md:ml-auto md:pb-0'>
                     <StrapiImage media={heroSection.heroImage} />
                  </div>
               </div>
            </div>
            <Stats data={stats} />
         </div>
         <Ellipse />
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
      </section>
   );
};

export default Hero;
