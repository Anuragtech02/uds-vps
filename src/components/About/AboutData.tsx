import { GoalIcon, RocketIcon, VisionIcon } from '../commons/Icons';
import Stats from '../commons/Stats';
import aboutImg from '@/assets/img/aboutStock.jpg';
import StrapiImage from '../StrapiImage/StrapiImage';

const AboutData = ({ about }: any) => {
   const {
      researchSectionTitle,
      researchSectionSubtitle,
      researchSectionDescription,
      researchSectionImage,
      visionMissionCards,
      visionMissionDescription,
   } = about;
   return (
      <>
         <div className='bg-s-50 py-10 md:py-16'>
            <div className='container'>
               <div className='text-center'>
                  <h2>
                     <div
                        dangerouslySetInnerHTML={{
                           __html: researchSectionTitle,
                        }}
                     />
                  </h2>
                  <div className='mt-5 inline-block rounded-md bg-[#E6EBFF] p-3 px-6'>
                     <p className='font-bold'>{researchSectionSubtitle}</p>
                  </div>
               </div>
               <div>
                  <div className='py-6 text-left'>{/* <Stats /> */}</div>
                  <div className='flex flex-col-reverse items-center gap-8 pt-8 md:flex-row md:pt-12'>
                     <div
                        className='space-y-4 md:w-1/2'
                        dangerouslySetInnerHTML={{
                           __html: researchSectionDescription,
                        }}
                     >
                        {/* <p className='font-bold text-s-800'>
                           UnivDatos Market Insights (UMI), a subsidiary of
                           Universal Data Solutions is a rapidly growing dynamic
                           market research firm led by a core of dedicated
                           professionals. We equip our clients with sustainable
                           strategies to shape win-win business strategies for
                           defining their future.
                        </p>
                        <p className='font-semibold text-s-500'>
                           We offer customized reports, consulting services, and
                           syndicated reports that helps aspiring change-makers
                           to make smart strategic decisions. Our team of expert
                           analysts critically evaluates the market dynamics and
                           illustrates competitive intelligence by diligent
                           sources, assisting clients in better understanding
                           across different industry verticals, globally.
                        </p>
                        <p className='font-semibold text-s-500'>
                           Our niche lies in delivering exclusive custom-made
                           business solutions specific to the client. Besides,
                           we have expertise in doing extensive and exhaustive
                           research on niche sectors by embracing new and
                           advanced technologies.
                        </p> */}
                     </div>
                     <div className='md:w-1/2'>
                        <img
                           src={researchSectionImage?.url}
                           className='h-auto w-full object-contain'
                           alt=''
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className='py-10 md:py-16'>
            <div className='container'>
               <div className='grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'>
                  <div>
                     <h2>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: researchSectionTitle,
                           }}
                        />
                     </h2>
                     <p className='mt-2 text-lg font-bold text-s-800'>
                        {visionMissionDescription}
                     </p>
                  </div>
                  {visionMissionCards.map((item: any, index: number) => (
                     <div
                        className='flex flex-col items-start gap-4 rounded-md border border-s-300 bg-white p-8 md:flex-row'
                        key={index}
                     >
                        <p>
                           {/* <RocketIcon /> */}
                           {item?.image?.data?.attributes?.url && (
                              <StrapiImage
                                 className='!w-10 max-w-10'
                                 media={item?.image?.data?.attributes}
                                 objectFit='contain'
                              />
                           )}
                        </p>
                        <div className='space-y-2'>
                           <p className='text-2xl font-bold md:text-[2rem]'>
                              {item.title}
                           </p>
                           <p className='font-medium'>{item.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
};

export default AboutData;
