import React from 'react';
import Button from './Button';
import { FaArrowRightLong } from 'react-icons/fa6';

const CustomResearchCTA = () => {
   return (
      <div className='rounded-xl border border-s-300 bg-gradient-to-r from-[rgba(128,189,255,0.3)] via-[rgba(94,197,230,0.3)] to-[rgba(60,204,204,0.3)] px-10 py-8'>
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
      </div>
   );
};

export default CustomResearchCTA;
