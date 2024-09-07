import React from 'react';
import Button from './Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import reportIllustration from '@/assets/img/report.svg';

const CustomResearchCTA = () => {
   return (
      <div className='relative overflow-hidden rounded-xl border border-s-300 bg-gradient-to-r from-[rgba(128,189,255,0.3)] via-[rgba(94,197,230,0.3)] to-[rgba(60,204,204,0.3)] px-6 py-8 md:px-10'>
         <div className='md:w-2/3'>
            <h2>
               <span>Tailored insights</span> for your unique needs.{' '}
               <br className='hidden md:block' /> Request a{' '}
               <span>custom research</span> report now!
            </h2>

            <Button
               size='large'
               variant='secondary'
               className='mt-6'
               icon={<FaArrowRightLong />}
            >
               Request Custom Research
            </Button>
         </div>
         <img
            src={reportIllustration.src}
            className='-bottom-[100px] right-10 mx-auto mt-10 h-[300px] w-auto object-contain md:absolute md:mt-0'
            alt=''
         />
      </div>
   );
};

export default CustomResearchCTA;
