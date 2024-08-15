import Image from 'next/image';
import newPlaceHolder from '@/assets/img/newPlaceholder.jpg';
import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';

interface BlogItemProps {
   title: string;
   date: string;
}

const BlogItem: FC<BlogItemProps> = ({ title, date }) => {
   return (
      <div className='flex flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'>
         <div className='relative aspect-video rounded-md md:w-1/3'>
            <Image
               src={newPlaceHolder}
               alt='news'
               fill
               className='rounded-xl'
            />
         </div>
         <div className='md:w-2/3'>
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

export default BlogItem;
