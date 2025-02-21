import React from 'react';

// Modify ReportListLoading.tsx
const ReportListLoading = ({ viewType }: { viewType: 'list' | 'grid' }) => {
   return (
      <div
         className={`mt-4 grid min-h-[800px] gap-4 sm:mt-0 ${
            viewType === 'list'
               ? 'grid-cols-1'
               : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
         }`}
      >
         {[...Array(10)].map((_, index) => (
            <div
               key={index}
               className='animate-pulse rounded-lg bg-gray-200'
               style={{
                  height: viewType === 'list' ? '200px' : '400px',
                  // Match your actual report item dimensions
               }}
            />
         ))}
      </div>
   );
};

export default ReportListLoading;
