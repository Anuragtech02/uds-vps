// export const runtime = 'edge';
import NewsBody from '@/components/News/NewsBody';
import NewsSidebar from '@/components/News/NewsSidebar';
import Header from '@/components/News/Header';
import RelatedNews from '@/components/News/RelatedNews';
import { getNewsBySlug } from '@/utils/api/services';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import { redirect } from 'next/navigation';
import { absoluteUrl, removeTrailingslash } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { SUPPORTED_LOCALES } from '@/utils/constants';

export const revalidate = 3600;

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
      lang: string;
   };
}): Promise<Metadata> {
   const newsDataList = await getNewsBySlug(params.slug, params.lang);
   const newsPage = newsDataList.data?.length > 0 ? newsDataList.data[0] : null;

   if (!newsPage) {
      return {
         title: 'News article Not Found',
         description: 'The requested news article could not be found.',
      };
   }

   const { attributes } = newsPage;
   const seo = attributes?.seo;

   const languagesMap: Record<string, string> = {};

   // Add English version if current lang is not English
   if (params.lang !== 'en') {
      languagesMap['en'] = absoluteUrl(`/news/${params.slug}`);
   }

   // Add other language versions, skipping the current language
   SUPPORTED_LOCALES.filter(
      (locale) => locale !== 'en' && locale !== params.lang,
   ).forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}/news/${params.slug}`);
   });

   const canonicalUrl = removeTrailingslash(
      seo?.canonicalURL ||
         absoluteUrl(
            params.lang && params.lang === 'en'
               ? `/news/${params.slug}`
               : `/${params.lang}/news/${params.slug}`,
         ),
   );

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
         canonical: canonicalUrl,
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
   const { slug, lang: locale = 'en' } = props?.params;
   let newsArticle: Awaited<ReturnType<typeof getNewsBySlug>>;

   try {
      newsArticle = await getNewsBySlug(slug, locale);
   } catch (error) {
      console.error('Error fetching news details:', error);
      // redirect to not found page
      redirect('/en/not-found');
   }

   if (!newsArticle?.data?.length) {
      redirect(`/${locale}/not-found`);
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
                  locale={locale}
               />
            )}
         </div>
      </div>
   );
};

export default News;
