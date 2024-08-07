import FAQItem from './ReportFaqItem';

const sampleFAQs = [
   {
      question: 'What is the purpose of the report?',
      answer:
         'The purpose of the report is to provide a comprehensive analysis of the market trends, drivers, challenges, and opportunities in the industry.',
   },
   {
      question: 'What is the purpose of the report?',
      answer:
         'The purpose of the report is to provide a comprehensive analysis of the market trends, drivers, challenges, and opportunities in the industry.',
   },
   {
      question: 'What is the purpose of the report?',
      answer:
         'The purpose of the report is to provide a comprehensive analysis of the market trends, drivers, challenges, and opportunities in the industry.',
   },
   {
      question: 'What is the purpose of the report?',
      answer:
         'The purpose of the report is to provide a comprehensive analysis of the market trends, drivers, challenges, and opportunities in the industry.',
   },
   {
      question: 'What is the purpose of the report?',
      answer:
         'The purpose of the report is to provide a comprehensive analysis of the market trends, drivers, challenges, and opportunities in the industry.',
   },
];

const ReportFAQs = () => {
   return (
      <section className='min-h-max bg-white'>
         <div className='container'>
            <h2 className='py-8 text-center text-blue-1'>
               Frequently Asked Questions <span>FAQs</span>
            </h2>
            <div className='mx-auto space-y-4 md:w-3/4'>
               {sampleFAQs.map((faq, index) => (
                  <FAQItem key={index} {...faq} />
               ))}
            </div>
         </div>
      </section>
   );
};

export default ReportFAQs;
