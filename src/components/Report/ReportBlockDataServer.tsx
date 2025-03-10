import dynamic from 'next/dynamic';
import { JSDOM } from 'jsdom';

interface ReportBlockDataProps {
   data: any;
}

// Server-side HTML processing function for research methodology
const processRM = (rmData: string): string => {
   if (!rmData) return '';

   try {
      const dom = new JSDOM(rmData);
      const doc = dom.window.document;

      const h2 = doc.querySelector('h2');
      if (h2 && h2.textContent === 'Research Methodology') {
         h2.remove();
      }

      const priceBreakup = doc.querySelector('.price-breakup');
      if (priceBreakup) {
         priceBreakup.remove();
      }

      const images = doc.querySelectorAll('img');

      images.forEach((img: HTMLImageElement, idx: number) => {
         const tempUrl = img.getAttribute('src');
         const originalSrc = tempUrl ? replaceWithCloudfrontURL(tempUrl) : '';
         if (originalSrc && originalSrc.includes('://')) {
            try {
               // Parse the URL to extract components
               const urlObj = new URL(originalSrc);
               const pathSegments = urlObj.pathname.split('/');
               const filename = pathSegments[pathSegments.length - 1];

               // Create the base path without the filename
               const basePath = pathSegments
                  .slice(0, pathSegments.length - 1)
                  .join('/');

               // Create URLs for different sizes
               const smallSrc = `${urlObj.protocol}//${urlObj.host}${basePath}/small_${filename}${urlObj.search}`;
               const mediumSrc = `${urlObj.protocol}//${urlObj.host}${basePath}/medium_${filename}${urlObj.search}`;

               // Set srcset attribute
               img.setAttribute(
                  'srcset',
                  `${smallSrc} 480w, ${mediumSrc} 768w, ${originalSrc} 1280w`,
               );

               // Set sizes attribute based on typical responsive behavior
               img.setAttribute(
                  'sizes',
                  '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1279px) 50vw, 100vw',
               );
               img.setAttribute('src', originalSrc);
               img.setAttribute('loading', 'lazy');
            } catch (error) {
               console.error('Error processing image URL:', error);
            }
         }
      });

      return doc.body.innerHTML;
   } catch (error) {
      console.error('Error processing research methodology:', error);
      return rmData;
   }
};

function replaceWithCloudfrontURL(imageUrl: string) {
   const cloudfrontURL = 'd21aa2ghywi6oj.cloudfront.net';
   return imageUrl.replace('udsweb.s3.ap-south-1.amazonaws.com', cloudfrontURL);
}

// Server-side HTML processing function to add srcset to images
const addSrcSetToImages = (htmlContent: string): string => {
   if (!htmlContent) return htmlContent;

   try {
      const dom = new JSDOM(htmlContent);
      const doc = dom.window.document;

      const images = doc.querySelectorAll('img');

      images.forEach((img: HTMLImageElement, idx: number) => {
         const tempUrl = img.getAttribute('src');
         const originalSrc = tempUrl ? replaceWithCloudfrontURL(tempUrl) : '';
         if (originalSrc && originalSrc.includes('://')) {
            try {
               // Parse the URL to extract components
               const urlObj = new URL(originalSrc);
               const pathSegments = urlObj.pathname.split('/');
               const filename = pathSegments[pathSegments.length - 1];

               // Create the base path without the filename
               const basePath = pathSegments
                  .slice(0, pathSegments.length - 1)
                  .join('/');

               // Create URLs for different sizes
               const smallSrc = `${urlObj.protocol}//${urlObj.host}${basePath}/small_${filename}${urlObj.search}`;
               const mediumSrc = `${urlObj.protocol}//${urlObj.host}${basePath}/medium_${filename}${urlObj.search}`;
               // const largeSrc = `${urlObj.protocol}//${urlObj.host}${basePath}/large_${filename}${urlObj.search}`;

               // Set srcset attribute
               img.setAttribute(
                  'srcset',
                  `${smallSrc} 480w, ${mediumSrc} 768w, ${originalSrc} 1280w`,
               );

               // Set sizes attribute based on typical responsive behavior
               img.setAttribute(
                  'sizes',
                  '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1279px) 50vw, 100vw',
               );
               img.setAttribute('src', originalSrc);
               if (idx > 0) {
                  img.setAttribute('loading', 'lazy');
               }
            } catch (error) {
               console.error('Error processing image URL:', error);
            }
         }
      });

      return doc.body.innerHTML;
   } catch (error) {
      console.error('Error during HTML processing:', error);
      return htmlContent; // Return original content if processing fails
   }
};

export default function ReportBlockDataServer({ data }: ReportBlockDataProps) {
   // Process both HTML sections
   const rmData = data.researchMethodology
      ? processRM(data.researchMethodology)
      : '';
   const processedDescription = data.description
      ? addSrcSetToImages(data.description)
      : '';

   // Dynamically import the interactive Table of Contents component as a client component
   const InteractiveTOC = dynamic(() => import('./InteractiveTOC'), {
      ssr: false,
   });

   return (
      <div className='space-y-6 text-s-700 md:px-4'>
         <div
            id='report-data'
            className='report-content section-anchor'
            dangerouslySetInnerHTML={{ __html: processedDescription }}
         />

         <div className='section-anchor'>
            <h2 className='text-2xl font-semibold text-blue-2'>
               Table of Contents
            </h2>
            <InteractiveTOC tableOfContent={data.tableOfContent} />
         </div>

         <div
            id='research-methodology'
            className='report-content section-anchor !pt-12'
            dangerouslySetInnerHTML={{ __html: rmData }}
         />
      </div>
   );
}
