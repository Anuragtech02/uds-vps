import ReportStoreItem from '../ReportStore/ReportItem';

const ReportResults = ({ reports }: any) => {
   return (
      <div className='flex flex-col gap-4'>
         {reports?.map((report: any) => (
            <ReportStoreItem
               key={report?.slug}
               date={new Date(
                  report.oldPublishedAt ||
                     report.publishedAt ||
                     report?.createdAt,
               ).toDateString()}
               title={report?.title}
               description={report?.shortDescription}
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
