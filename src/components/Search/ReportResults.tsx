import { getFormattedDate } from '@/utils/generic-methods';
import ReportStoreItem from '../ReportStore/ReportItem';

const ReportResults = ({ reports, locale = 'en' }: any) => {
   return (
      <div className='flex flex-col gap-4'>
         {reports?.map((report: any) => (
            <ReportStoreItem
               key={report?.slug}
               date={getFormattedDate(report, locale)}
               title={report?.title}
               description={report?.shortDescription}
               slug={report?.slug}
               highlightImageUrl={report?.highlightImage}
               size='small'
               locale={locale}
            />
         ))}
         {reports?.length === 0 && <p>No reports found</p>}
      </div>
   );
};

export default ReportResults;
