import CustomResearchCTA from '../commons/CustomResearchCTA';

const AboutCta = ({ ctaBanner }: any) => {
   return (
      <div className='py-16'>
         <div className='container'>
            <CustomResearchCTA ctaBanner={ctaBanner} />
         </div>
      </div>
   );
};

export default AboutCta;
