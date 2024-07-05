import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import Button from './commons/Button';
import { BsArrowRight } from 'react-icons/bs';

const CalendarSvg = () => (
   <svg
      width='14'
      height='16'
      viewBox='0 0 14 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
   >
      <g clip-path='url(#clip0_335_2319)'>
         <path
            opacity='0.4'
            d='M0 6H14V14.5C14 15.3281 13.3281 16 12.5 16H1.5C0.671875 16 0 15.3281 0 14.5V6Z'
            fill='#009090'
         />
         <path
            d='M5 1C5 0.446875 4.55312 0 4 0C3.44688 0 3 0.446875 3 1V2H1.5C0.671875 2 0 2.67188 0 3.5V6H14V3.5C14 2.67188 13.3281 2 12.5 2H11V1C11 0.446875 10.5531 0 10 0C9.44687 0 9 0.446875 9 1V2H5V1Z'
            fill='#009090'
         />
      </g>
      <defs>
         <clipPath id='clip0_335_2319'>
            <rect width='14' height='16' fill='white' />
         </clipPath>
      </defs>
   </svg>
);

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

               <Button
                  onClick={cta}
                  size='small'
                  variant='secondary'
                  className='mt-2'
               >
                  Select options
               </Button>
            </div>
         )}
         {type === 'latest' && (
            <p className='mt-2 flex items-center gap-2 text-xs uppercase'>
               <a href=''>View Report </a>{' '}
               <span>
                  <BsArrowRight />
               </span>
            </p>
         )}
      </div>
   );
};

export default ResearchCard;
