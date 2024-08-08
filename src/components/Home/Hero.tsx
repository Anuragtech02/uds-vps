import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import Ellipse from '../commons/Ellipse';
import { IoIosSearch } from 'react-icons/io';
import Image from 'next/image';
import heroImage from '@/assets/img/heroStock.jpg';
import TypewritterText from '../TypewritterText';
import Stats from '../commons/Stats';

const Hero = () => {
   return (
      <section className='relative bg-white pt-16 md:pt-20'>
         <div className='container'>
            <div className='flex flex-col-reverse items-center gap-6 py-16 md:flex-row md:py-32'>
               <div className='md:w-[60%]'>
                  <h1>
                     Unlock <TypewritterText /> <br /> Insights with
                     Comprehensive Research
                  </h1>

                  <div className='mt-6 flex items-center gap-3 rounded-full border border-blue-2 px-6 py-3 md:w-2/3'>
                     <span className='text-2xl'>
                        <IoIosSearch />
                     </span>
                     <input
                        type='text'
                        placeholder='Search for reports, industries and more...'
                        className='w-full bg-transparent text-[1.125rem] outline-none'
                     />
                  </div>

                  <div className='mt-4 flex flex-col gap-2 py-4 md:mt-10 md:flex-row md:items-center'>
                     <Button
                        size='large'
                        variant='secondary'
                        icon={<FaArrowRightLong />}
                     >
                        Explore Reports
                     </Button>
                     <Button
                        size='large'
                        variant='light'
                        icon={<FaArrowRightLong />}
                     >
                        Request a Demo
                     </Button>
                  </div>
               </div>
               <div className='w-full md:w-[40%]'>
                  <div className='relative ml-auto aspect-square w-full md:w-2/3'>
                     <Image
                        src={heroImage}
                        className='h-auto w-full rounded-xl'
                        alt='hero'
                        fill
                     />
                  </div>
               </div>
            </div>
            <Stats />
         </div>
         <Ellipse />
      </section>
   );
};

export default Hero;
