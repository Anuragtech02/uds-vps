import React from 'react';
import Button from './Button';
import { FaArrowRightLong } from 'react-icons/fa6';

const CustomResearchCTA = ({ ctaBanner }) => {
   return (
      <div className='rounded-xl border border-s-300 bg-gradient-to-r from-[rgba(128,189,255,0.3)] via-[rgba(94,197,230,0.3)] to-[rgba(60,204,204,0.3)] px-10 py-8'>
         <div className='md:w-2/3'>
            <h2>
               <div dangerouslySetInnerHTML={{ __html: ctaBanner?.title }} />
            </h2>

            <Button
               size='large'
               variant='secondary'
               className='mt-6'
               icon={<FaArrowRightLong />}
            >
               {ctaBanner?.ctaButton?.title}
            </Button>
         </div>
      </div>
   );
};

export default CustomResearchCTA;
