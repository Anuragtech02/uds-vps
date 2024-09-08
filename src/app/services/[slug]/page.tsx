import Hero from '@/components/Services/Hero';
import { getServiceBySlug } from '@/utils/api/services';


const Service = async (data: any) => {
   const { slug } = data?.params;
   console.log(slug, 'here');
   let service: Awaited<ReturnType<typeof getServiceBySlug>>;

   try {
      service = await getServiceBySlug(slug);
   } catch (error) {
      console.error('Error fetching blog details:', error);
   }

   if (!service?.data?.length) {
      return <p>Not found</p>;
   }
   let blog = service?.data?.[0]?.attributes;
   return (
      <div className='bg-s-50'>
         <Hero hero={{
            heroSectionHeading: service?.data?.[0]?.attributes?.title,
            heroSectionDescription: service?.data?.[0]?.attributes?.shortDescription
         }} />
         <div className='container report-content py-8'>
            <div dangerouslySetInnerHTML={{
                __html: service?.data?.[0]?.attributes?.description
            }}></div>
         </div>
      </div>
   );
};

export default Service;
