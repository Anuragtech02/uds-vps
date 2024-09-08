import AllServices from '@/components/Services/AllServices';
import Hero from '@/components/Services/Hero';
import { getServicesPage, getAllServices } from '@/utils/api/services';

const About = async () => {
   let data: Awaited<ReturnType<typeof getServicesPage>>;
   let allServicesList: Awaited<ReturnType<typeof getAllServices>>;

   try {
    [data, allServicesList] = await Promise.all([getServicesPage(), getAllServices()]);
    console.log(allServicesList)
    } catch (error) {
        console.error('Error fetching about page:', error);
    }

    const hero = {
        heroSectionHeading: data?.data?.attributes?.heroSectionHeading ?? '',
        heroSectionDescription: data?.data?.attributes?.heroSectionDescription ?? '',
    }

    const servicesList = allServicesList?.data?.map((service: any) => ({
        id: service?.id,
        slug: service?.attributes?.slug,
        title: service?.attributes?.title,
        description: service?.attributes?.description,
        shortDescription: service?.attributes?.shortDescription,
    }));


   return (
      <>
         <Hero hero={hero} />
         <AllServices services={servicesList} />
      </>
   );
};

export default About;
