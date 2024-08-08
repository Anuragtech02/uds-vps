import step1 from '@/assets/img/order-process/1.png';
import step2 from '@/assets/img/order-process/2.png';
import step3 from '@/assets/img/order-process/3.png';
import step4 from '@/assets/img/order-process/4.png';

const processItems = [
   {
      title: 'Browse for Reports',
      image: step1,
   },
   {
      title: 'Select a Report',
      image: step2,
   },
   {
      title: 'Purchase',
      image: step3,
   },
   {
      title: 'Delivered in 24 Hours',
      image: step4,
   },
];

const OrderProcess = () => {
   return (
      <div className='bg-blue-1 py-10 md:py-16'>
         <div className='container'>
            <div className='text-center text-white'>
               <h2 className='text-white'>
                  Report Order <span className='text-white'>Process</span>
               </h2>
               <p className='mx-auto mt-2 md:w-2/3'>
                  We thrive to deliver high-quality reports. To order our
                  reports simply follow the steps mentioned below:
               </p>
            </div>
            <div className='mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4'>
               {processItems.map((item, index) => (
                  <div
                     key={index}
                     className='flex flex-col gap-3 rounded-xl bg-blue-3 p-6 pb-0 font-semibold'
                  >
                     <p className='text-2xl text-green-3 md:text-5xl'>
                        0{index + 1}
                     </p>
                     <p className='text-xl text-white md:text-2xl'>
                        {item.title}
                     </p>
                     <img
                        src={item.image.src}
                        className='mx-auto mb-0 mt-auto h-auto w-[90%] items-baseline'
                        alt=''
                     />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default OrderProcess;
