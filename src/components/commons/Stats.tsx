import buildingIcon from '@/assets/img/stats/buildings.svg';
import clipboardIcon from '@/assets/img/stats/clipboard.svg';
import earthIcon from '@/assets/img/stats/earth.svg';
import usersIcon from '@/assets/img/stats/users.svg';
import mircochip from '@/assets/img/stats/microchip.svg';

const stats = [
   {
      title: 'Fortune 500 companies work with us',
      count: 15,
      image: buildingIcon,
   },
   {
      title: 'Technologies Covered',
      count: 200,
      image: mircochip,
   },
   {
      title: 'Countries covered',
      count: 100,
      image: earthIcon,
   },
   {
      title: 'Projects Completed',
      count: 1500,
      image: clipboardIcon,
   },
   {
      title: 'Delighted Customers',
      count: 1250,
      image: usersIcon,
   },
];

const Stats = () => {
   return (
      <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
         {stats.map((stat) => (
            <div
               key={stat.title}
               className='relative flex flex-col justify-between rounded-md border border-s-200 bg-white p-4'
            >
               <p>{stat.title}</p>
               <h3 className='mt-6 font-bricolage text-4xl font-bold text-blue-4 md:text-6xl'>
                  {stat.count}+
               </h3>
               <img
                  src={stat.image.src}
                  className='absolute bottom-0 right-0 aspect-square h-20'
                  alt=''
               />
            </div>
         ))}
      </div>
   );
};

export default Stats;
