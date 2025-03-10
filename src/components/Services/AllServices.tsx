import React from 'react';

const AllServices = ({ services }: any) => {
   return (
      <div className='container space-y-12 py-8'>
         {services?.map((service: any, index: number) => (
            // Add scroll-margin-top to offset the sticky header
            <div
               key={index}
               id={service?.slug}
               className='scroll-mt-40 space-y-8 rounded-md border border-s-300 bg-white p-8'
            >
               {/* Rest of your component remains the same */}
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
                  <div className='flex w-full flex-col justify-start space-y-4 md:w-3/5'>
                     <h2 className='text-3xl font-bold'>{service?.title}</h2>
                     {service?.shortDescription?.length > 0 && (
                        <p
                           className='report-content text-gray-700'
                           dangerouslySetInnerHTML={{
                              __html: service?.shortDescription,
                           }}
                        ></p>
                     )}
                  </div>
               </div>
               {service?.description?.length > 0 && (
                  <div
                     className={`prose report-content max-w-none border-t pt-8`}
                  >
                     <div
                        dangerouslySetInnerHTML={{
                           __html: service?.description,
                        }}
                        className='![&>ol>li>ul>li>p]:ml-0'
                     />
                  </div>
               )}
            </div>
         ))}
      </div>
   );
};

export default AllServices;
