import React from 'react';

const AllServices = ({ services }: any) => {
   return (
      <div className='container space-y-12 py-8'>
         {services?.map((service: any, index: number) => (
            <div
               key={index}
               className='space-y-8 rounded-md border border-s-300 bg-white p-8'
            >
               {/* Top section with image and short description */}
               <div
                  className={`flex flex-col gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
               >
                  <div className='w-full flex-shrink-0 md:w-2/5'>
                     <img
                        src={service?.image}
                        alt={service?.title}
                        className='h-[300px] w-full rounded-md object-cover'
                     />
                  </div>
                  <div className='flex w-full flex-col justify-center space-y-4 md:w-3/5'>
                     <h2 className='text-2xl font-bold md:text-4xl'>
                        {service?.title}
                     </h2>
                     <p className='text-lg text-gray-700'>
                        {service?.shortDescription}
                     </p>
                  </div>
               </div>

               {/* Full width main content section below */}
               <div className='prose report-content max-w-none border-t pt-8'>
                  <div
                     dangerouslySetInnerHTML={{
                        __html: service?.description,
                     }}
                  />
               </div>
            </div>
         ))}
      </div>
   );
};

export default AllServices;
