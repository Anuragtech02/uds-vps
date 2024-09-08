import Link from 'next/link';
import ReportStoreItem from '../ReportStore/ReportItem';

const ReportResults = ({ reports }) => {
   return (
      <div>
         {reports?.map((report) => (
            <Link href={`/reports/${report?.slug}`} key={report?.id}>
               <ReportStoreItem
                  date={new Date(report?.createdAt).toDateString()}
                  title={report?.title}
                  description={report?.shortDescription}
                  priceRange={''}
                  sku={''}
                  key={report?.id}
               />
            </Link>
         ))}
         {reports?.length === 0 && <p>No reports found</p>}
      </div>
   );
};

export default ReportResults;
