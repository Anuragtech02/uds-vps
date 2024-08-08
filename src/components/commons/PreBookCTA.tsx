import { FaArrowRightLong } from 'react-icons/fa6';
import Button from './Button';
import prebookBg from '@/assets/img/prebook-bg.png';

const PreBookCTA = () => {
   return (
      <div className='relative overflow-hidden rounded-xl bg-blue-1 p-8 py-12 text-white'>
         <img
            src={prebookBg.src}
            className='absolute inset-0 z-[1] h-full w-full object-cover object-center'
            alt=''
         />
         <div className='relative z-[2] mx-auto flex w-[95%] flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <h2 className='text-white'>
               <span className='text-white'>Pre book</span> this report and get
               huge discounts!
            </h2>
            <Button
               size='large'
               variant='light'
               className='shrink-0 grow-0'
               icon={<FaArrowRightLong />}
            >
               Get in touch
            </Button>
         </div>
      </div>
   );
};

export default PreBookCTA;
