import GetCallBackForm from '@/components/commons/GetCallBackForm';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import SearchResults from '@/components/Search/SearchResults';
import { IoIosSearch } from 'react-icons/io';

const Search = (props: {
   searchParams: {
      q: string;
   };
}) => {
   const { searchParams } = props;

   return (
      <div className='container pt-40'>
         <div className='mt-10'>
            <div className='flex flex-col-reverse items-start gap-6 md:flex-row md:gap-10'>
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[1.75rem] font-semibold text-s-500'>
                     Search result for: &apos;{searchParams?.q}&apos;
                  </p>
                  <SearchResults />
               </div>
               <div className='flex-[0.4] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>   
                  <div className='bg-white'>
                     <GetCallBackForm />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Search;
