import {
   BsFacebook,
   BsInstagram,
   BsLinkedin,
   BsTwitterX,
   BsYoutube,
} from 'react-icons/bs';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import StrapiImage from '../StrapiImage/StrapiImage';

const ContactDetails = ({ contactDetails }: any) => {
   const contacts = contactDetails?.contactDetailsList?.map((contact: any) => ({
      ...contact,
      icon: contact?.icon?.data?.attributes,
   }));
   console.log(JSON.stringify(contacts));
   return (
      <div className='rounded-xl bg-white p-4 font-medium text-blue-2 md:p-6'>
         <div className='space-y-6 md:space-y-8'>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>
                  {contactDetails?.contactSectionTitle}
               </p>
               <div className='flex items-center gap-4'>
                  {contacts?.map((contact: any) => {
                     return (
                        <div className='flex items-center gap-2'>
                           <StrapiImage media={contact?.icon} />
                           <p>{contact?.title}</p>
                        </div>
                     );
                  })}
               </div>
            </div>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>
                  {contactDetails?.locationSectionTitle}
               </p>
               <p>{contactDetails?.locationSectionDescription}</p>
            </div>
            <div>
               <p className='mb-2 text-[1.625rem] text-blue-1'>
                  {contactDetails?.socialMediaSectionTitle}
               </p>
               <div className='flex items-center gap-4'>
                  {contactDetails?.socialMediaSectionIconsList?.map(
                     (socialMedia: any) => {
                        return (
                           <a href={socialMedia?.link}>
                              <StrapiImage
                                 media={socialMedia?.icon?.data?.attributes}
                              />
                           </a>
                        );
                     },
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ContactDetails;
