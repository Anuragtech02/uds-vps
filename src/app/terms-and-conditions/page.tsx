import ClientSearchHero from "@/components/Home/ClientSearchHero";
import NewsSidebar from "@/components/News/NewsSidebar";
import { getTermsAndConditions } from "@/utils/api/services";

export const runtime = 'edge';


const page = async () => {

   const res = await getTermsAndConditions();
   const data = res.data.attributes;


   return   (
      <div className='bg-s-50'>
         <div className='mt-[100px] sm:mt-[150px] pb-10 pt-20 sm:py-20 flex justify-center items-center border-b' >
            <h1 className="font-bold">{data?.heroHeading}</h1>
         </div>
         <div className='container'>
            <div className='flex flex-col gap-6 md:gap-10 lg:flex-row pb-8'>
               <div className='flex-[0.7]'>
                  <div className="report-content" dangerouslySetInnerHTML={{
                     __html: data?.description ?? '',
                  }} />
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
   )
};

export default page;
