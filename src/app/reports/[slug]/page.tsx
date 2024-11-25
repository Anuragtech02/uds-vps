import ExploreProjects from '@/components/Report/ExploreProjects';
import Header from '@/components/Report/Header';
import ReportBlock from '@/components/Report/ReportBlock';
import ReportFAQs from '@/components/Report/ReportFAQs';
import { getAllReports, getReportsPageBySlug } from '@/utils/api/services';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Forces dynamic rendering, bypassing all static optimizations

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
   };
}): Promise<Metadata> {
   const reportDataList = await getReportsPageBySlug(params.slug);

   let reportPage =
      reportDataList.data?.length > 0 ? reportDataList.data[0] : null;

   return {
      title: reportPage?.attributes?.title,
      description: reportPage?.attributes?.shortDescription,
      openGraph: {
         images: [
            reportPage?.attributes?.highlightImage?.data?.attributes?.url,
         ],
      },
   };
}

const page: React.FC<{
   params: {
      slug: string;
   };
}> = async ({ params }) => {
   let relatedReports, reportDataList;
   try {
      reportDataList = await getReportsPageBySlug(params.slug);
      relatedReports = await getAllReports(1, 10, {
         industry: reportDataList.data[0]?.attributes?.industry?.data?.id,
      });
   } catch (err) {
      console.log(err);
   }
   console.log({ relatedReports });
   let reportPage =
      reportDataList.data?.length > 0 ? reportDataList.data[0] : null;
   let relatedReportsData =
      relatedReports?.data?.map((report: any) => report?.attributes) ?? [];
   return (
      <div className='bg-s-50'>
         <div className='mt-4' />
         <Header data={reportPage} />
         <ReportBlock data={reportPage} />
         <ReportFAQs data={reportPage} />
         <ExploreProjects reports={relatedReportsData} />
      </div>
   );
};

export default page;
