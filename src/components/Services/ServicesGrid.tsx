'use client';

import React from 'react';

interface ServiceItem {
   slug: string;
   title: string;
}

const ServicesGrid = ({ services }: { services: ServiceItem[] }) => {
   const scrollToService = (slug: string) => {
      const element = document.getElementById(slug);
      if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
      }
   };

   return (
      <>
         <div className='mt-8'>
            <div className='mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
               {services?.map((service, index) => (
                  <button
                     key={service.slug}
                     onClick={() => scrollToService(service.slug)}
                     className={`text-primary rounded-lg bg-[#E5EEFF] px-4 py-6 text-sm font-medium transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        index === services.length - 1 &&
                        services.length % 3 === 1
                           ? 'sm:col-start-2'
                           : ''
                     }`}
                  >
                     {service.title}
                  </button>
               ))}
            </div>
         </div>
      </>
   );
};

export default ServicesGrid;
