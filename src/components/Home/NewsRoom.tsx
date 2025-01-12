import Image from 'next/image';
import newsPlaceholder from '@/assets/img/thumbnail_news.jpg';
import newPlaceHolder from '@/assets/img/newPlaceholder.jpg';
import { CalendarSvg, UserSvg } from '../commons/Icons';
import Link from 'next/link';
import { LocalizedLink } from '../commons/LocalizedLink';

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
      <section className='min-h-max py-4 md:py-10'>
         <div className='container'>
            <div className='my-6 flex flex-col items-stretch gap-4 lg:my-10 lg:mt-0 lg:flex-row'>
               <div className='md:w-1/2'>
                  <h3 className='mb-6 text-blue-2'>Our Blogs</h3>
                  {data?.blogs.map((blog, index) => (
                     <LocalizedLink href={`/blogs/${blog.slug}`} key={index}>
                        <div
                           className='rounded-xl bg-white p-6 transition-colors hover:bg-blue-1 hover:bg-opacity-10'
                           key={index}
                        >
                           <div className='relative aspect-video w-full rounded-md'>
                              <Image
                                 src={newsPlaceholder}
                                 alt='news'
                                 fill
                                 className='rounded-xl object-cover'
                              />
                           </div>
                           <div className='flex flex-wrap gap-2 py-4'>
                              {blog?.tags
                                 ?.split(',')
                                 .filter(
                                    (b: string) =>
                                       !['blog', 'news'].includes(
                                          b.toLowerCase(),
                                       ),
                                 )
                                 .map((tag: string, index: number) => (
                                    <div
                                       key={index}
                                       className='rounded-full border border-green-1 px-3 py-1 text-xs capitalize text-green-1'
                                    >
                                       {tag}
                                    </div>
                                 ))}
                           </div>
                           <h4 className='mb-2 text-2xl font-semibold'>
                              {blog.title}
                           </h4>
                           <p className='text-sm text-s-800'>
                              {blog.descrption}
                           </p>
                           <div className='mt-4 flex items-center gap-6'>
                              <p className='flex items-center gap-2'>
                                 <CalendarSvg />{' '}
                                 {new Date(
                                    blog.oldPublishedAt || blog.publishedAt,
                                 ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                              <p className='flex items-center gap-2'>
                                 <UserSvg />{' '}
                                 {blog.author?.data?.attributes?.name}
                              </p>
                           </div>
                        </div>
                     </LocalizedLink>
                  ))}
               </div>
               <div className='md:w-1/2'>
                  <h3 className='mb-6 text-blue-2'>Latest News</h3>
                  <div className='flex flex-col gap-6'>
                     {data?.newsArticles.map((news, index) => (
                        <LocalizedLink href={`/news/${news.slug}`} key={index}>
                           <div
                              key={index}
                              className='flex flex-col gap-4 rounded-xl bg-white p-6 transition-colors hover:bg-blue-1 hover:bg-opacity-10 md:flex-row'
                           >
                              <div className='relative aspect-video rounded-md md:w-1/3'>
                                 <Image
                                    src={newsPlaceholder}
                                    alt='news'
                                    fill
                                    className='rounded-xl object-cover'
                                 />
                              </div>
                              <div className='md:w-2/3'>
                                 <h4 className='mb-2 text-xl font-semibold'>
                                    {news.title.length > 60
                                       ? news.title.substring(0, 60) + '...'
                                       : news.title}
                                 </h4>
                                  <p className='my-2 flex items-center gap-2'>
                                    <CalendarSvg />
                                    {new Date(
                                      news.oldPublishedAt || news.publishedAt,
                                    ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                  </p>
                              </div>
                           </div>
                        </LocalizedLink>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default NewsRoom;
