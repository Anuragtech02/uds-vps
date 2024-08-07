import { allCitations } from '@/assets/img/citations';

const MediaCitation = () => {
   return (
      <section className='bg-s-50 py-20 md:min-h-max'>
         <div className='container'>
            <div className='pb-10 text-center md:pb-16'>
               <h2>
                  Media <span>Citations</span>
               </h2>
               <p className='mx-auto md:w-2/3 md:text-2xl'>
                  Contemplate and gaze at our reports cited by the
                  inquisitors/specialists of leading media/publishing houses.
               </p>
            </div>
            <div className='grid grid-cols-5'>
               {allCitations.map((img, index) => (
                  <div
                     key={index}
                     className={`grid place-items-center px-10 py-5 ${index % 2 === 0 ? 'bg-s-100' : 'bg-white'} `}
                  >
                     <img
                        className='h-[80px] w-full object-contain'
                        src={img.src}
                     />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default MediaCitation;
