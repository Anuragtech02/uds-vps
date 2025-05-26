import Image from 'next/image';
import newPlaceHolder from '@/assets/img/sampleResearch.png';
import { CalendarSvg } from '../commons/Icons';
import { FC } from 'react';
import Button from '../commons/Button';
import Link from 'next/link';
import { LocalizedLink } from '../commons/LocalizedLink';
import StrapiImage, { Media } from '../StrapiImage/StrapiImage';

interface ReportStoreItemProps {
   title: string;
   date: string;
   description: string;
   slug: string;
   viewType?: string;
   highlightImageUrl: Media;
   size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
   locale?: string;
}

const ReportStoreItem: FC<ReportStoreItemProps> = ({
   title,
   date,
   description,
   slug,
   viewType,
   highlightImageUrl,
   size = 'small',
   locale = 'en',
}) => {
   return (
      <div className='flex flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'>
         <div className='relative aspect-square h-auto w-[180px] rounded-xl border border-s-300'>
            {typeof highlightImageUrl === 'string' ? (
               <Image
                  src={highlightImageUrl || newPlaceHolder}
                  alt='report-item'
                  fill
                  className='rounded-xl object-cover object-center'
                  sizes='(max-width: 768px) 100vw, 180px'
                  unoptimized
               />
            ) : (
               <StrapiImage
                  media={highlightImageUrl}
                  alt='report-item'
                  size={size}
                  objectFit='fill'
                  className='rounded-xl object-contain'
               />
            )}
         </div>
         <div className='grow space-y-3 md:w-2/3'>
            <h4 className='line-clamp-3 overflow-hidden text-lg font-semibold hover:underline'>
               <LocalizedLink
                  href={`/reports/${slug}`}
                  className='w-full'
                  lang={locale}
               >
                  <span dangerouslySetInnerHTML={{ __html: title }}></span>
               </LocalizedLink>
            </h4>
            {viewType === 'list' && (
               <p className='text-gray-600'>
                  {description.length > 200
                     ? description.substring(0, 200) + '...'
                     : description}
               </p>
            )}
            {/* {showPrice && (
               <div className='inline-block rounded-full bg-blue-9 px-4 py-2 text-lg font-medium text-blue-1'>
                  <p>{priceRange}</p>
               </div>
            )} */}
            <div className='flex w-full items-end justify-between'>
               <div className='flex flex-col space-y-3'>
                  <p className='flex items-center gap-2 text-sm font-semibold'>
                     <CalendarSvg />
                     {date}
                  </p>
                  {/* <p className='text-sm font-semibold'>SKU: {sku}</p> */}
                  <LocalizedLink
                     href={`/reports/${slug}?popup=report-enquiry`}
                     className='mt-2'
                     lang={locale}
                  >
                     <Button variant='light' size='small'>
                        Download Sample
                     </Button>
                  </LocalizedLink>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ReportStoreItem;
