import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import FAQItem from './ReportFaqItem';

const ReportFAQs = ({
   data,
   locale,
}: {
   data: {
      attributes: {
         faqList: any[];
      };
   };
   locale: string;
}) => {
   const faqList = data?.attributes?.faqList || [];

   const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((faq, index) => ({
         '@type': 'Question',
         name: `Q${index + 1}: ${faq.title}`,
         acceptedAnswer: {
            '@type': 'Answer',
            text: `Ans: ${faq.description}`,
         },
      })),
   };

   return (
      <section className='section-anchor min-h-max py-0'>
         <div className='w-full sm:px-8' id='faq-section'>
            {faqList.length > 0 && (
               <h2 className='pb-8 text-center text-blue-1'>
                  {TRANSLATED_VALUES[locale]?.report.frequentlyAskedQuestions}{' '}
                  <span>{TRANSLATED_VALUES[locale]?.report.faqs}</span>
               </h2>
            )}
            <div className='mx-auto space-y-4'>
               {faqList.map((faq, index) => (
                  <FAQItem key={index} {...faq} />
               ))}
            </div>
         </div>
         <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
         />
      </section>
   );
};

export default ReportFAQs;
