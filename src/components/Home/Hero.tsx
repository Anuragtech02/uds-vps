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

                  <div className='mt-4 flex flex-col gap-2 py-4 md:mt-10 md:flex-row md:items-center'>
                     <Link href={heroSection.heroPrimaryCTA.link}>
                        <Button
                           size='large'
                           variant='secondary'
                           icon={<FaArrowRightLong />}
                        >
                           {heroSection.heroPrimaryCTA.title}
                        </Button>
                     </Link>
                     <Link href={heroSection.heroSecondaryCTA.link}>
                        <Button
                           size='large'
                           variant='light'
                           icon={<FaArrowRightLong />}
                        >
                           {heroSection.heroSecondaryCTA.title}
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className='relative w-full md:w-[40%]'>
                  <img
                     src={reportIllustration.src}
                     className='absolute -bottom-20 right-[70%] z-[5] hidden aspect-[2/3] w-[240px] lg:block'
                     alt=''
                  />

                  <div className='relative ml-auto aspect-square w-full md:w-[80%]'>
                     <StrapiImage media={heroSection.heroImage} />
                  </div>
               </div>
            </div>
            <Stats data={stats} />
         </div>
         <Ellipse />
         <Popup paramName='popup-form' title="Request a Demo">
            <DemoRequestForm />
         </Popup>
      </section>
   );
};

export default Hero;
