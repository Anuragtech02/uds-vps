import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import Ellipse from '../commons/Ellipse';
import TypewritterText from '../TypewritterText';
import Stats from '../commons/Stats';
import StrapiImage from '../StrapiImage/StrapiImage';
import ClientSearchHero from './ClientSearchHero';
import Popup from '../Popup';
import DemoRequestForm from './DemoRequestForm';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { LocalizedLink } from '../commons/LocalizedLink';

const Hero: React.FC<{ data: any; locale?: string }> = ({ data, locale }) => {
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

   return (
      <section className='relative bg-white pt-16 md:pt-20'>
         <div className='container'>
            <div className='flex flex-col-reverse items-center gap-6 py-16 pb-10 md:flex-row md:py-32 md:pb-16'>
               <div className='md:w-[60%]'>
                  <h1>
                     <TypewritterText
                        markets={heroSection.animationIndustriesList}
                        heading={heroSection.heroMainHeading}
                     />
                  </h1>
                  <ClientSearchHero />

                  <div className='mt-4 flex flex-col gap-2 py-4 md:mt-10 lg:flex-row lg:items-center'>
                     <LocalizedLink
                        href={heroSection.heroPrimaryCTA.link}
                        lang={locale}
                     >
                        <Button
                           className='w-full lg:w-auto'
                           size='large'
                           variant='secondary'
                           icon={<FaArrowRightLong />}
                        >
                           {heroSection.heroPrimaryCTA.title}
                        </Button>
                     </LocalizedLink>
                     <LocalizedLink
                        href={heroSection.heroSecondaryCTA.link}
                        lang={locale}
                     >
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
                  <div className='relative mx-auto aspect-square h-[400px] w-[80%] overflow-hidden rounded-xl pb-10 md:ml-auto md:pb-0 xl:h-[420px]'>
                     <StrapiImage
                        media={heroSection.heroImage}
                        size='medium'
                        priority
                        height={400}
                        width={300}
                     />
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
