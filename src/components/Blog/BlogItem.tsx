import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';
import Image from 'next/image';
import thumbnailNewsPlaceholder from '@/assets/img/thumbnail_news.jpg';

interface BlogItemProps {
   title: string;
   date: string;
   slug: string;
   shortDescription: string;
   thumbnailImage: {
      url: string;
      altContent: string;
      width: number;
      height: number;
   };
   viewType?: string;
}

const BlogItem: FC<BlogItemProps> = ({
   title,
   date,
   slug,
   shortDescription,
   thumbnailImage,
   viewType = 'list',
}) => {
   return (
      <div
         className={`w-full rounded-xl bg-white p-6 transition-all duration-300 hover:shadow-lg ${
            viewType === 'list'
               ? 'flex flex-col gap-4 md:flex-row'
               : 'flex flex-col gap-4'
         }`}
      >
         <div
            className={`relative rounded-md ${
               viewType === 'list'
                  ? 'aspect-video md:w-1/3'
                  : 'aspect-video w-full'
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
         <div className={viewType === 'list' ? 'md:w-2/3' : 'w-full'}>
            <h4 className='mb-2 line-clamp-2 text-xl font-semibold hover:text-blue-600'>
               {title}
            </h4>
            <p className='line-clamp-3 text-gray-600'>{shortDescription}</p>
            <p className='my-2 flex items-center gap-2 text-gray-500'>
               <CalendarSvg />
               {date}
            </p>
         </div>
      </div>
   );
};

export default BlogItem;
