import CustomResearchCTA from '../commons/CustomResearchCTA';

const AboutCta = ({ ctaBanner, locale = 'en' }: any) => {
   return (
      <div className='py-16'>
         <div className='container'>
            <CustomResearchCTA ctaBanner={ctaBanner} locale={locale} />
         </div>
      </div>
   );
};

export default AboutCta;
