import Link from 'next/link'
import React from 'react'

const AllServices = ({services}) => {


  return (
    <div className='container grid grid-cols-2 gap-4 py-8'>
        {services?.map((service: any, index: number) => (
          <Link href={`/services/${service?.slug}`}>
               <div
               className='flex flex-col items-start gap-4 rounded-md border border-s-300 bg-white p-8 md:flex-row'
               key={index}
            >
               <div className='space-y-2'>
                  <p className='text-2xl font-bold md:text-[2rem]'>
                     {service?.title}
                  </p>
               <p>{service?.shortDescription}</p>
               </div>
            </div>
        </Link>
        ))}
    </div>
  )
}

export default AllServices