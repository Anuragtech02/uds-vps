'use client';

import { useRouter } from 'next/navigation';

interface PaginationProps {
   filters: string[];
   currentPage: number;
   totalPages: number;
}

const ReportsPagination: React.FC<PaginationProps> = ({
   filters,
   currentPage,
   totalPages,
}) => {
   let pageNumber;
   const router = useRouter();
   const handlePageChange = (add: number) => {
      router.push(
         `/report-store?filter=${filters?.join(',')}&page=${parseInt(pageNumber) + add}`,
      );
   };
   try {
      pageNumber = parseInt(currentPage);
   } catch (e) {
      console.log(e);
      router.push(`/report-store?filter=${filters?.join(',')}&page=1`);
   }
   return (
      <div className='my-4 flex items-center justify-center space-x-2'>
         <button
            onClick={() => handlePageChange(-1)}
            disabled={pageNumber === 1}
            className='rounded-md border px-4 py-2 disabled:opacity-50'
         >
            Previous
         </button>
         <span>
            {pageNumber} of {totalPages}
         </span>
         <button
            onClick={() => handlePageChange(+1)}
            disabled={pageNumber === totalPages}
            className='rounded-md border px-4 py-2 disabled:opacity-50'
         >
            Next
         </button>
      </div>
   );
};

export default ReportsPagination;
