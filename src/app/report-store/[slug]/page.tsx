import ExploreProjects from '@/components/Report/ExploreProjects';
import Header from '@/components/Report/Header';
import ReportBlock from '@/components/Report/ReportBlock';
import ReportFAQs from '@/components/Report/ReportFAQs';
import { getReportsPageBySlug } from '@/utils/api/services';
import Head from 'next/head';

const page: React.FC<{
   params: {
      slug: string;
   };
}> = async ({ params }) => {
   const reportDataList = await getReportsPageBySlug(params.slug);

   let reportPage =
      reportDataList.data?.length > 0 ? reportDataList.data[0] : null;

   return (
      <div className='bg-s-50'>
         <Head>
            <title>{reportPage.attributes.title}</title>
            <meta
               name='description'
               content={reportPage.attributes.shortDescription}
            />
         </Head>
         <div className='mt-40' />
         <Header data={reportPage} />
         <ReportBlock data={reportPage} />
         {/* <ReportFAQs />
         <ExploreProjects /> */}
      </div>
   );
};

export default page;
