// export const runtime = 'edge';
import ContactDetails from '@/components/Contact/ContactDetails';
import ContactForm from '@/components/Contact/ContactForm';
import { getContagePageData } from '@/utils/api/services';

const Contact = async () => {
   let contactPageData: Awaited<ReturnType<typeof getContagePageData>>;

   try {
      contactPageData = await getContagePageData();
   } catch (error) {
      console.error('Error fetching main menu:', error);
   }

   if (!contactPageData) {
      return <div>Error fetching contact page data</div>;
   }
   let contactDetails = {
      contactSectionTitle:
         contactPageData?.data?.attributes?.contactSectionTitle,
      locationSectionTitle:
         contactPageData?.data?.attributes?.locationSectionTitle,
      locationSectionDescription:
         contactPageData?.data?.attributes?.locationSectionDescription,
      socialMediaSectionTitle:
         contactPageData?.data?.attributes?.socialMediaSectionTitle,
      contactFormTitle: contactPageData?.data?.attributes?.contactFormTitle,
      contactFormSubmitText:
         contactPageData?.data?.attributes?.contactFormSubmitText,
      contactDetailsList: contactPageData?.data?.attributes?.contactDetailsList,
      socialMediaSectionIconsList:
         contactPageData?.data?.attributes?.socialMediaSectionIconsList,
      contactFormFields: contactPageData?.data?.attributes?.contactFormFields,
   };
   return (
      <div className='container pt-40'>
         <div className='my-10 flex flex-col-reverse items-start gap-6 md:gap-10 lg:flex-row'>
            <div className='w-full lg:w-max lg:flex-[0.4]'>
               <ContactDetails contactDetails={contactDetails} />
            </div>

            <div className='w-full lg:w-max lg:flex-[0.6]'>
               <ContactForm />
            </div>
         </div>
         <div className='mb-10 w-full overflow-hidden rounded-lg'>
            <iframe
               src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.105250042955!2d77.32551197642748!3d28.596619185708878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4fc8229f2eb%3A0xd2f74545b7c6d686!2sunivdatos!5e0!3m2!1sen!2sin!4v1724409606048!5m2!1sen!2sin'
               className='aspect-[9/3] w-full border-0'
               allowFullScreen={true}
               loading='lazy'
               referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
         </div>
      </div>
   );
};

export default Contact;
