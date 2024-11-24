import Image from 'next/image';
import newPlaceHolder from '@/assets/img/newPlaceholder.jpg';
import { CalendarSvg, UserSvg } from '../commons/Icons';
import logo from '@/assets/img/logo.png';
import Link from 'next/link';

// const newsItems = [
//    {
//       title: 'Global Nitrogen Oxide Control System Market Top emerging startups in the energy sector',
//       date: '12th July 2025',
//    },
//    {
//       title: 'Global Nitrogen Oxide Control System Market Top emerging startups in the energy sector',
//       date: '12th July 2025',
//    },
//    {
//       title: 'Global Nitrogen Oxide Control System Market Top emerging startups in the energy sector',
//       date: '12th July 2025',
//    },
// ];

// const blogs = [
//    {
//       category: 'Energy and power',
//       title: 'Top emerging startups in the energy sector',
//       date: '12th July 2025',
//       author: 'John Doe',
//       descrption:
//          'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
//    },
// ];

const NewsRoom: React.FC<{
   data: {
      blogs: Array<any>;
      newsArticles: Array<any>;
   };
}> = ({ data }) => {
   return (
      <section className='min-h-max py-12 md:py-20'>
         <div className='container'>
            <div className='my-6 flex flex-col gap-4 lg:my-10 lg:mt-0 lg:flex-row'>
               <div className='md:w-1/2'>
                  <h3 className='mb-6 text-blue-2'>Our Blogs</h3>
                  {data?.blogs.map((blog, index) => (
                     <div className='rounded-xl bg-white p-6' key={index}>
                        <div className='relative aspect-video w-full rounded-md'>
                           <Image
                              src={newPlaceHolder}
                              alt='news'
                              fill
                              className='rounded-xl'
                           />
                        </div>
                        {blog?.tags?.split(',').map((tag, index) => (
                           <div
                              key={index}
                              className='my-3 inline-block rounded-full border border-s-400 px-6 py-2 text-sm capitalize text-green-1'
                           >
                              {tag}
                           </div>
                        ))}
                        <h4 className='mb-2 text-2xl font-semibold'>
                           {blog.title}
                        </h4>
                        <p className='text-sm text-s-800'>{blog.descrption}</p>
                        <div className='mt-4 flex items-center gap-6'>
                           <p className='flex items-center gap-2'>
                              <CalendarSvg />{' '}
                              {new Date(blog.publishedAt).toLocaleDateString()}
                           </p>
                           <p className='flex items-center gap-2'>
                              <UserSvg /> {blog.author?.data?.attributes?.name}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className='md:w-1/2'>
                  <h3 className='mb-6 text-blue-2'>Latest News</h3>
                  <div className='flex flex-col gap-6'>
                     {data?.newsArticles.map((news, index) => (
                        <Link href={`/news/${news.slug}`} key={index}>
                           <div
                              key={index}
                              className='flex flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'
                           >
                              <div className='relative aspect-video rounded-md md:w-1/3'>
                                 <Image
                                    src={newPlaceHolder}
                                    alt='news'
                                    fill
                                    className='rounded-xl'
                                 />
                              </div>
                              <div className='md:w-2/3'>
                                 <div className='my-2 flex items-center'>
                                    <p className='font-medium'>Univdatos</p>
                                 </div>
                                 <h4 className='mb-2 text-xl font-semibold'>
                                    {news.title.length > 60
                                       ? news.title.substring(0, 60) + '...'
                                       : news.title}
                                 </h4>
                                 <p className='my-2 flex items-center gap-2'>
                                    <CalendarSvg />
                                    {new Date(
                                       news.publishedAt,
                                    ).toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default NewsRoom;
