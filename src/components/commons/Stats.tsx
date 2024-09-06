import StrapiImage from '../StrapiImage/StrapiImage';

const Stats: React.FC<{ data: any }> = ({ data }) => {
   return (
      <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
         {data.map((stat: any) => (
            <div
               key={stat.title}
               className='relative flex flex-col justify-between rounded-md border border-s-200 bg-white p-4'
            >
               <p>{stat.title}</p>
               <h3 className='mt-6 font-bricolage text-4xl font-bold text-blue-4 md:text-6xl'>
                  {stat.countTo}+
               </h3>
               <img
                  src={stat.icon.url}
                  className='absolute bottom-0 right-0 aspect-square h-20'
                  alt=''
               />
            </div>
         ))}
      </div>
   );
};

export default Stats;
