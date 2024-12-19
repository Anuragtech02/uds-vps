export const runtime = 'edge';
import GetCallBackForm from '@/components/commons/GetCallBackForm';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import SearchResults from '@/components/Search/SearchResults';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';

const Search = (props: {
   searchParams: {
      q: string;
   };
}) => {
   const { searchParams } = props;

   return (
      <div className='container pt-40'>
         <div className='mt-10'>
            <div className='flex flex-col items-start gap-6 md:flex-row md:gap-10'>
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[1.75rem] font-semibold text-s-500'>
                     Search result for: &apos;{searchParams?.q}&apos;
                  </p>
                  <Suspense fallback={
                     <div className='flex h-32 items-center justify-center'>
                        <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
                     </div>
                  }>
                     <SearchResults />
                  </Suspense>
               </div>
               <div className='flex-[0.4] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>   
                  <div className='bg-white [&>div]:w-full sm:[&>div]:w-auto'>
                     <GetCallBackForm />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Search;
