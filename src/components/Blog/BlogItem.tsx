import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';
import StrapiImage from '../StrapiImage/StrapiImage';

interface BlogItemProps {
   title: string;
   date: string;
   shortDescription: string;
   thumbnailImage: {
      url: string;
      altContent: string;
      width: number;
      height: number;
   };
}

const BlogItem: FC<BlogItemProps> = ({
   title,
   date,
   shortDescription,
   thumbnailImage,
}) => {
   return (
      <div className='flex w-full flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'>
         <div className='relative aspect-video rounded-md md:w-1/3'>
            <StrapiImage
               media={thumbnailImage}
               objectFit='cover'
               className='rounded-md'
            />
         </div>
         <div className='md:w-2/3'>
            <div className='my-2 flex items-center'>
               <p className='font-medium'>Univdatos</p>
            </div>
            <h4 className='mb-2 text-xl font-semibold'>
               {title}
               {/* {title.length > 60 ? title.substring(0, 60) + '...' : title} */}
            </h4>
            <p className='text-gray-600'>{shortDescription}</p>
            <p className='my-2 flex items-center gap-2'>
               <CalendarSvg />
               {date}
            </p>
         </div>
      </div>
   );
};

export default BlogItem;
