import GetCallBackForm from '@/components/commons/GetCallBackForm';
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
                  <div className='flex items-center gap-3 rounded-full border border-blue-2 px-6 py-3'>
                     <span className='text-2xl'>
                        <IoIosSearch />
                     </span>
                     <input
                        type='text'
                        placeholder='Search for reports, industries and more...'
                        className='w-full bg-transparent text-[1.125rem] outline-none'
                     />
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
