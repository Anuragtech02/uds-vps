import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import Button from './commons/Button';
import { BsArrowRight } from 'react-icons/bs';
import { CalendarSvg } from './commons/Icons';
import Link from 'next/link';

interface ResearchCardProps {
   type: string;
   title: string;
   image: StaticImageData | string;
   description?: string;
   cta?: () => void;
   year?: string;
   id?: string;
   sku?: string;
   date?: string;
}

const ResearchCard: FC<ResearchCardProps> = ({
   type,
   title,
   image,
   description,
   year,
   cta,
   id,
   sku,
   date,
}) => {
   return (
      <div className='flex-col rounded-xl border border-s-200 bg-white p-3'>
         <div className='relative aspect-square w-full overflow-hidden rounded-xl'>
            <Image src={image} alt={title} fill />
         </div>
         {type === 'latest' && (
            <div className='my-2 inline-block rounded-full bg-blue-9 px-2 py-1 text-xs'>
               {year}
            </div>
         )}
         <p
            className={`my-2 font-bold ${type === 'latest' ? 'text-base' : 'text-xl'}`}
         >
            {title}
         </p>
         {type === 'upcoming' && (
            <div className='flex flex-col gap-2 text-sm'>
               <p className='text-s-500'>{description}</p>
               <p className='flex items-center gap-2 font-semibold text-s-700'>
                  <CalendarSvg />
                  {date}
               </p>
               <p className='font-semibold text-s-700'>SKU: {sku}</p>

               <Link href={`/report-store/${sku || 1254}`}>
                  <Button
                     onClick={cta}
                     size='small'
                     variant='secondary'
                     className='mt-2 w-full'
                  >
                     Select options
                  </Button>
               </Link>
            </div>
         )}
         {type === 'latest' && (
            <p className='mt-2 flex items-center gap-2 text-xs uppercase'>
               <Link href={`/report-store/${sku || 1254}`}>View Report </Link>{' '}
               <span>
                  <BsArrowRight />
               </span>
            </p>
         )}
      </div>
   );
};

export default ResearchCard;
