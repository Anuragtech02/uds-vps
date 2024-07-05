import Button from '../commons/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import Ellipse from '../commons/Ellipse';
import { IoIosSearch } from 'react-icons/io';

const stats = [
   {
      title: 'Fortune 500 companies work with us',
      count: 15,
   },
   {
      title: 'Technologies Covered',
      count: 200,
   },
   {
      title: 'Countries covered',
      count: 100,
   },
   {
      title: 'Projects Completed',
      count: 1500,
   },
   {
      title: 'Delighted Customers',
      count: 1250,
   },
];

const Hero = () => {
   return (
      <section className='relative bg-white md:pt-20'>
         <div className='container'>
            <div className='flex items-center gap-6 py-16 md:py-32'>
               <div className='w-1/2'>
                  <h1>
                     Unlock <span className='capitalize'>Enegery market</span>{' '}
                     Insights with Comprehensive Research
                  </h1>

                  <div className='mt-6 flex w-2/3 items-center gap-3 rounded-full border border-blue-2 px-6 py-3'>
                     <span className='text-2xl'>
                        <IoIosSearch />
                     </span>
                     <input
                        type='text'
                        placeholder='Search for reports, industries and more...'
                        className='w-full bg-transparent text-[1.125rem] outline-none'
                     />
                  </div>

                  <div className='mt-10 flex items-center gap-2 py-4'>
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
            <div className='mt-12 grid grid-cols-5 gap-4'>
               {stats.map((stat) => (
                  <div
                     key={stat.title}
                     className='flex flex-col justify-between rounded-md border border-s-200 bg-white p-4'
                  >
                     <p>{stat.title}</p>
                     <h3 className='font-bricolage mt-6 text-6xl font-bold text-blue-4'>
                        {stat.count}+
                     </h3>
                  </div>
               ))}
            </div>
         </div>
         <Ellipse />
      </section>
   );
};

export default Hero;
