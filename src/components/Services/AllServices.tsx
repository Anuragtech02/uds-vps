import Link from 'next/link';
import React from 'react';

const AllServices = ({ services }: any) => {
   return (
      <div className='container grid grid-cols-2 gap-4 py-8'>
         {services?.map((service: any, index: number) => (
            <Link
               href={`/services/${service?.slug}`}
               className='h-full'
               key={index}
            >
               <div className='flex h-full flex-col items-start gap-4 rounded-md border border-s-300 bg-white p-8 transition-all duration-200 ease-in-out hover:bg-blue-8 md:flex-row'>
                  <div className='space-y-2'>
                     <img
                        src={service?.image}
                        alt='service'
                        className='h-[200px] w-full rounded-md object-cover'
                     />
                     <p className='mt-4 text-2xl font-bold md:text-[2rem]'>
                        {service?.title}
                     </p>
                     <p>{service?.shortDescription}</p>
                  </div>
               </div>
            </Link>
         ))}
      </div>
   );
};

export default AllServices;
