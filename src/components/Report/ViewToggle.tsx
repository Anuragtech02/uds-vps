'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import listIcon from '@/assets/img/ListIcon.svg';
import gridIcon from '@/assets/img/GridIcon.svg';
import Image from 'next/image';

interface ViewToggleProps {
   currentView: string;
}

const ViewToggle = ({ currentView }: ViewToggleProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();

   const handleViewChange = (viewType: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('viewType', viewType);
      router.push(`?${params.toString()}`);
   };

   return (
      <div className='flex items-center gap-2 rounded-lg border bg-white p-2'>
         <button
            onClick={() => handleViewChange('list')}
            className={`flex items-center gap-1 rounded p-2 ${
               currentView === 'list' ? 'bg-gray-100' : ''
            }`}
            aria-label='List view'
         >
            <Image
               unoptimized
               src={listIcon.src}
               width={16}
               height={16}
               alt='List view'
               className='h-4 w-4'
            />
         </button>
         <button
            onClick={() => handleViewChange('grid')}
            className={`flex items-center gap-1 rounded p-2 ${
               currentView === 'grid' ? 'bg-gray-100' : ''
            }`}
            aria-label='Grid view'
         >
            <Image
               unoptimized
               src={gridIcon.src}
               width={16}
               height={16}
               alt='Grid view'
               className='h-4 w-4'
            />
         </button>
      </div>
   );
};

export default ViewToggle;
