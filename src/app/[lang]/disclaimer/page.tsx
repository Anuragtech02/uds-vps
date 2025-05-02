import ClientSearchHero from '@/components/Home/ClientSearchHero';
import NewsSidebar from '@/components/News/NewsSidebar';
import { getDisclaimer } from '@/utils/api/services';

// export const runtime = 'edge';

const Page: React.FC<{
   params: {
      lang: string;
   };
}> = async ({ params }) => {
   const res = await getDisclaimer(params.lang);
   const data = res.data.attributes;

   return (
      <div className='bg-s-50'>
         <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
            <h1 className='font-bold'>{data?.heroHeading}</h1>
         </div>
         <div className='container'>
            <div className='flex flex-col gap-6 pb-8 md:gap-10 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <div
                     className='report-content'
                     dangerouslySetInnerHTML={{
                        __html: data?.description ?? '',
                     }}
                  />
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <NewsSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Page;
