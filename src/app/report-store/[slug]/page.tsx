import Header from '@/components/Report/Header';
import ReportBlock from '@/components/Report/ReportBlock';
import ReportFAQs from '@/components/Report/ReportFAQs';

const page = () => {
   return (
      <div className='bg-s-50'>
         <div className='mt-40' />
         <Header />
         <ReportBlock />
         <ReportFAQs />
      </div>
   );
};

export default page;
