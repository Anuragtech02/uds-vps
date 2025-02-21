import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import { CalendarSvg } from './commons/Icons';
import Link from 'next/link';
import Button from './commons/Button';
import { LocalizedLink } from './commons/LocalizedLink';
import StrapiImage, { Media } from './StrapiImage/StrapiImage';

interface ResearchCardProps {
   type: string;
   title: string;
   image: Media;
   description?: string;
   slug: string;
   cta?: () => void;
   year?: string;
   id?: string;
   sku?: string;
   date?: string;
}

const ResearchCard: FC<ResearchCardProps> = ({
   type,
   title,
   slug,
   image,
   description,
   year,
   cta,
   id,
   date,
}) => {
   return (
      <div className='!h-full flex-col rounded-xl border border-s-200 bg-white p-3'>
         <div className='relative aspect-square w-full overflow-hidden rounded-xl bg-[#d1e0ff]/20'>
            <StrapiImage
               media={image}
               alt={title}
               objectFit='fill'
               size='small'
               className='object-contain'
            />
         </div>
         <p
            className={`my-2 line-clamp-2 overflow-hidden font-bold hover:underline ${type === 'latest' ? 'text-base' : 'text-xl'}`}
         >
            <LocalizedLink href={`/reports/${slug}`}>
               <span
                  dangerouslySetInnerHTML={{
                     __html: title,
                  }}
               ></span>
            </LocalizedLink>
         </p>
         <div className='flex flex-col gap-2 text-sm'>
            <p className='line-clamp-2 text-s-500'>{description}</p>
            <p
               suppressHydrationWarning
               className='flex items-center gap-2 font-semibold text-s-700'
            >
               <CalendarSvg />
               {date}
            </p>

            {/* <LocalizedLink href={`/reports/${sku || 1254}`}>
                     <Button
                        onClick={cta}
                        size='small'
                        variant='secondary'
                        className='mt-2 w-full'
                     >
                        Select options
                     </Button>
                  </LocalizedLink> */}
            <LocalizedLink href={`/reports/${slug}?popup=report-enquiry`}>
               <Button variant='light' size='small' className='w-full'>
                  Download Sample
               </Button>
            </LocalizedLink>
         </div>
         {/* {type === 'latest' && (
               <p className='mt-2 flex items-center gap-2 text-xs uppercase'>
                  <LocalizedLink href={`/reports/${sku || 1254}`}>View Report </LocalizedLink>{' '}
                  <span>
                     <BsArrowRight />
                  </span>
               </p>
            )} */}
      </div>
   );
};

export default ResearchCard;
