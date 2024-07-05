import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';

const Hero = () => {
   return (
      <section>
         <div className='container'>
            <div className='flex items-center gap-6'>
               <div className='w-1/2'>
                  <h1 className='capitalize'>
                     Unlock enegery market insights{' '}
                     <span className='lowercase'>with</span> comprehensive
                     research
                  </h1>

                  <div className='flex items-center gap-2 py-4'>
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
            </div>
         </div>
      </section>
   );
};

export default Hero;
