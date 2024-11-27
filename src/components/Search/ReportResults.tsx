import Link from 'next/link';
import ReportStoreItem from '../ReportStore/ReportItem';
import { LocalizedLink } from '../commons/LocalizedLink';

const ReportResults = ({ reports }: any) => {
   return (
      <div>
         {reports?.map((report: any) => (
            <LocalizedLink href={`/reports/${report?.slug}`} key={report?.id}>
               <ReportStoreItem
                  date={new Date(report?.createdAt).toDateString()}
                  title={report?.title}
                  description={report?.shortDescription}
                  key={report?.id}
                  slug={report?.slug}
               />
            </LocalizedLink>
         ))}
         {reports?.length === 0 && <p>No reports found</p>}
      </div>
   );
};

export default ReportResults;
