import Image from 'next/image';
import newPlaceHolder from '@/assets/img/sampleResearch.png';
import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';
import Button from '../commons/Button';

interface ReportStoreItemProps {
   title: string;
   date: string;
   description: string;
}

const ReportStoreItem: FC<ReportStoreItemProps> = ({
   title,
   date,
   description,
}) => {
   return (
      <div className='flex flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'>
         <div className='relative aspect-square h-auto w-[180px] rounded-xl border border-s-300'>
            <Image
               src={newPlaceHolder}
               alt='news'
               fill
               className='rounded-xl object-contain'
            />
         </div>
         <div className='grow space-y-3 md:w-2/3'>
            <h4 className='text-xl font-semibold'>
               {title.length > 60 ? title.substring(0, 60) + '...' : title}
            </h4>
            <p className='text-gray-600'>
               {description.length > 100
                  ? description.substring(0, 100) + '...'
                  : description}
            </p>
            {/* {showPrice && (
               <div className='inline-block rounded-full bg-blue-9 px-4 py-2 text-lg font-medium text-blue-1'>
                  <p>{priceRange}</p>
               </div>
            )} */}
            <div className='flex w-full items-end justify-between'>
               <div className='space-y-3'>
                  <p className='flex items-center gap-2 text-sm font-semibold'>
                     <CalendarSvg />
                     {date}
                  </p>
                  {/* <p className='text-sm font-semibold'>SKU: {sku}</p> */}
               </div>
               {/* <Button variant='secondary' size='small'>
                  Select Options
               </Button> */}
            </div>
         </div>
      </div>
   );
};

export default ReportStoreItem;
