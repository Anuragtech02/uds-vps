import CustomResearchCTA from '../commons/CustomResearchCTA';

const AboutCta = ({ ctaBanner }) => {
   return (
      <div className='py-16 md:py-40'>
         <div className='container'>
            <CustomResearchCTA ctaBanner={ctaBanner} />
         </div>
      </div>
   );
};

export default AboutCta;
