import Link from 'next/link';
import ReportStoreItem from '../ReportStore/ReportItem';

const ReportResults = ({ reports }: any) => {
   return (
      <div>
         {reports?.map((report: any) => (
            <Link href={`/reports/${report?.slug}`} key={report?.id}>
               <ReportStoreItem
                  date={new Date(report?.createdAt).toDateString()}
                  title={report?.title}
                  description={report?.shortDescription}
                  key={report?.id}
               />
            </Link>
         ))}
         {reports?.length === 0 && <p>No reports found</p>}
      </div>
   );
};

export default ReportResults;
