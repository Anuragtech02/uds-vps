import Image from 'next/image';
import newPlaceHolder from '@/assets/img/newPlaceholder.jpg';
import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';

interface NewsItemProps {
   title: string;
   date: string;
}

const NewsItem: FC<NewsItemProps> = ({ title, date }) => {
   return (
      <div className='flex flex-col gap-4 rounded-xl border border-s-300 bg-white p-6'>
         <div className='relative aspect-video rounded-md'>
            <Image
               src={newPlaceHolder}
               alt='news'
               fill
               className='rounded-xl'
            />
         </div>
         <div className=''>
            <div className='my-2 flex items-center'>
               <p className='font-medium'>Univdatos</p>
            </div>
            <h4 className='mb-2 text-xl font-semibold'>
               {title.length > 60 ? title.substring(0, 60) + '...' : title}
            </h4>

            <p className='my-2 flex items-center gap-2'>
               <CalendarSvg />
               {date}
            </p>
         </div>
      </div>
   );
};

export default NewsItem;
