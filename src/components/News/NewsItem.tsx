import { FC } from 'react';
import { LocalizedLink } from '../commons/LocalizedLink';
import thumbnailNewsPlaceholder from '@/assets/img/thumbnail_news.jpg';
import { CalendarSvg } from '../commons/Icons';
import Image from 'next/image';

interface NewsItemProps {
   title: string;
   date: string;
   slug: string;
   thumbnailImage: {
      url: string;
      altContent: string;
      width: number;
      height: number;
   };
   viewType?: string;
}

const NewsItem: FC<NewsItemProps> = ({
   title,
   date,
   slug,
   thumbnailImage,
   viewType = 'grid',
}) => {
   return (
      <LocalizedLink href={`/news/${slug}`}>
         <div
            className={`group h-full rounded-xl border border-s-300 bg-white p-6 transition-all duration-300 hover:shadow-lg ${
               viewType === 'list'
                  ? 'flex flex-col gap-4 md:flex-row'
                  : 'flex flex-col gap-4'
            }`}
         >
            <div
               className={`relative rounded-md ${
                  viewType === 'list' ? 'h-[200px] md:w-1/3' : 'h-[100px]'
               }`}
            >
               <Image
                  src={thumbnailNewsPlaceholder.src}
                  alt={title}
                  fill
                  unoptimized
                  className='rounded-md object-cover transition-transform duration-300 group-hover:scale-105'
               />
            </div>
            <div className={viewType === 'list' ? 'md:w-2/3' : ''}>
               <h4 className='mb-2 line-clamp-2 text-xl font-semibold group-hover:text-blue-600'>
                  {title}
               </h4>
               <p className='flex items-center gap-2 text-gray-500'>
                  <CalendarSvg />
                  {date}
               </p>
            </div>
         </div>
      </LocalizedLink>
   );
};

export default NewsItem;
