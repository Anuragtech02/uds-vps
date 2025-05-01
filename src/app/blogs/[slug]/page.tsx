// export const runtime = 'edge';

import BlogBody from '@/components/Blog/BlogBody';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import Header from '@/components/Blog/Header';
import RelatedBlogs from '@/components/Blog/RelatedBlogs';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import { getBlogBySlug } from '@/utils/api/services';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
   };
}): Promise<Metadata> {
   const blogDataList = await getBlogBySlug(params.slug);
   const blogPage = blogDataList.data?.length > 0 ? blogDataList.data[0] : null;

   if (!blogPage) {
      return {
         title: 'Blog Not Found',
         description: 'The requested blog could not be found.',
      };
   }

   const { attributes } = blogPage;
   const seo = attributes?.seo;

   // Create languages map for alternates
   const languagesMap: Record<string, string> = {};

   // Add all language alternates if available
   // if (seo?.alternateLanguages) {
   //   Object.entries(seo.alternateLanguages).forEach(([locale, url]) => {
   //     languagesMap[locale] = url as string;
   //   });
   // }

   SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}/blogs/${params.slug}`);
   });

   // Base metadata object
   const metadata: Metadata = {
      title: seo?.metaTitle || attributes?.title,
      description: seo?.metaDescription || attributes?.shortDescription,

      openGraph: {
         title:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.title ||
            seo?.metaTitle ||
            attributes?.title,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.description ||
            seo?.metaDescription ||
            attributes?.shortDescription,
         type: 'article',
         url: absoluteUrl(`/blogs/${params.slug}`),
         images: [
            {
               url:
                  seo?.metaSocial?.find(
                     (social: any) => social.socialNetwork === 'facebook',
                  )?.image?.url ||
                  seo?.metaImage?.url ||
                  attributes?.highlightImage?.data?.attributes?.url,
               width: 1200,
               height: 630,
               alt: attributes?.title,
            },
         ],
         siteName: 'UnivDatos',
      },

      twitter: {
         card: 'summary_large_image',
         title:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.title ||
            seo?.metaTitle ||
            attributes?.title,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.description ||
            seo?.metaDescription ||
            attributes?.shortDescription,
         images: [
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.image?.url ||
               seo?.metaImage?.url ||
               attributes?.highlightImage?.data?.attributes?.url,
         ],
      },

      keywords: seo?.keywords || '',

      alternates: {
         canonical: seo?.canonicalURL || absoluteUrl(`/blogs/${params.slug}`),
         languages: languagesMap,
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'Article',
               headline: attributes?.title,
               description: attributes?.shortDescription,
               image: attributes?.highlightImage?.data?.attributes?.url,
               datePublished: attributes?.oldPublishedAt,
               author: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
               },
               publisher: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
                  logo: {
                     '@type': 'ImageObject',
                     url: absoluteUrl('/logo.png'),
                  },
               },
               ...seo?.structuredData,
            }),
         ],
      },
   };

   // Add extra scripts if defined
   if (seo?.extraScripts) {
      metadata.other = {
         ...metadata.other,
         ...seo.extraScripts,
      };
   }

   return metadata;
}

const Blog = async (data: any) => {
   const { slug } = data?.params;
   let blogDetails: Awaited<ReturnType<typeof getBlogBySlug>>;

   try {
      blogDetails = await getBlogBySlug(slug);
   } catch (error) {
      console.error('Error fetching blog details:', error);
   }

   if (!blogDetails?.data?.length) {
      redirect('/en/not-found');
   }

   let blog = blogDetails?.data?.[0]?.attributes;
   const currentBlogId = blogDetails?.data?.[0]?.id;
   const industries = blog?.industries;

   return (
      <div className='bg-s-50'>
         <div className='mt-0' />
         <Header blog={blog} locale='en' />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:gap-10 md:py-4 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <BlogBody blog={blog} />
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <BlogSidebar />
               </div>
            </div>
            <hr className='border-t border-gray-200' />
            {/* Client-side Related Blogs Section */}
            {industries?.data?.length > 0 && (
               <RelatedBlogs
                  currentBlogId={currentBlogId}
                  industries={industries}
               />
            )}
         </div>
      </div>
   );
};

export default Blog;
