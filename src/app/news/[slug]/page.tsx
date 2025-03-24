// export const runtime = 'edge';
import NewsBody from '@/components/News/NewsBody';
import NewsSidebar from '@/components/News/NewsSidebar';
import Header from '@/components/News/Header';
import RelatedNews from '@/components/News/RelatedNews';
import { getBlogDetails, getNewsBySlug } from '@/utils/api/services';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import { redirect } from 'next/navigation';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { SUPPORTED_LOCALES } from '@/utils/constants';

export const revalidate = false;

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
   };
}): Promise<Metadata> {
   const newsDataList = await getNewsBySlug(params.slug);
   const newsPage = newsDataList.data?.length > 0 ? newsDataList.data[0] : null;

   if (!newsPage) {
      return {
         title: 'News article Not Found',
         description: 'The requested news article could not be found.',
      };
   }

   const { attributes } = newsPage;
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
      languagesMap[locale] = absoluteUrl(`/${locale}/news/${params.slug}`);
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
         url: absoluteUrl(`/news/${params.slug}`),
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
         canonical: seo?.canonicalURL || absoluteUrl(`/news/${params.slug}`),
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

const News = async (props: any) => {
   const { slug } = props?.params;
   let newsArticle: Awaited<ReturnType<typeof getNewsBySlug>>;

   try {
      newsArticle = await getNewsBySlug(slug);
   } catch (error) {
      console.error('Error fetching news details:', error);
      // redirect to not found page
      redirect('/en/not-found');
   }

   if (!newsArticle?.data?.length) {
      redirect('/en/not-found');
   }

   let newsArticleData = newsArticle?.data?.[0]?.attributes;
   const currentNewsId = newsArticle?.data?.[0]?.id;
   const industries = newsArticleData?.industries;

   return (
      <div className='bg-s-50'>
         <div className='mt-0' />
         <Header newsArticle={newsArticleData} />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:gap-10 md:py-4 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <NewsBody newsArticle={newsArticleData} />
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <NewsSidebar />
               </div>
            </div>
            <hr className='border-t border-gray-200' />
            {/* Client-side Related News Section */}
            {industries?.data?.length > 0 && (
               <RelatedNews
                  currentNewsId={currentNewsId}
                  industries={industries}
               />
            )}
         </div>
      </div>
   );
};

export default News;
