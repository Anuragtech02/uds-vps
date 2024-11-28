import Image from 'next/image';
import thumbnailNewsPlaceholder from '@/assets/img/thumbnail_news.jpg';
import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';
import StrapiImage from '../StrapiImage/StrapiImage';

interface NewsItemProps {
   title: string;
   date: string;
   thumbnailImage: {
      url: string;
      altContent: string;
      width: number;
      height: number;
   };
}

const NewsItem: FC<NewsItemProps> = ({ title, date, thumbnailImage }) => {
   return (
      <div className='flex h-full flex-col gap-4 rounded-xl border border-s-300 bg-white p-6'>
         <div className='relative aspect-video rounded-md'>
            {/* <StrapiImage media={thumbnailImage} objectFit='fill' /> */}
            <Image src={thumbnailNewsPlaceholder.src} alt={title} fill className='rounded-md' objectFit='cover' />
         </div>
         <div className=''>
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
