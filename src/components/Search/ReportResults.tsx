import Link from 'next/link';
import ReportStoreItem from '../ReportStore/ReportItem';
import { LocalizedLink } from '../commons/LocalizedLink';

const ReportResults = ({ reports }: any) => {
   return (
      <div className='flex flex-col gap-4'>
         {reports?.map((report: any) => (
               <ReportStoreItem
                  date={new Date(
                     report.oldPublishedAt ||
                        report.publishedAt ||
                        report?.createdAt,
                  ).toDateString()}
                  title={report?.title}
                  description={report?.shortDescription}
                  key={report?.id}
                  slug={report?.slug}
                  highlightImageUrl={report?.highlightImage}
                  size='small'
               />
         ))}
         {reports?.length === 0 && <p>No reports found</p>}
      </div>
   );
};

export default ReportResults;
