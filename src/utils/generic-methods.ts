export const buildPopulateQuery = (fields: string[]): string => {
   if (!fields || fields.length === 0) {
      return '';
   }

   // Convert the array into a string format that Strapi expects for populate
   const populateString = fields
      .map((field, i) => `populate[${i}]=${field}`)
      .join('&');

   return populateString;
};

export function getCTALink(ctaUrl: string) {
   if (ctaUrl.startsWith('http')) {
      return ctaUrl;
   } else if (ctaUrl.startsWith('?')) {
      // if (!window?.location?.href) {
      //    return ctaUrl;
      // }
      // const currentUrl = window.location.href;
      // const url = new URL(currentUrl);
      // url.search = ctaUrl;
      // return url.href;
      return ctaUrl;
   } else if (ctaUrl.startsWith('/')) {
      return `${ctaUrl}`;
   } else {
      return `/${ctaUrl}`;
   }
}

export function absoluteUrl(path: string): string {
   return `${process.env.NEXT_PUBLIC_APP_URL || 'https://univdatos.com'}${path}`;
}

export function getFormattedDate(
   report: {
      publishedAt: string;
      oldPublishedAt: string | null;
      slug: string;
   },
   locale: string = 'en',
) {
   const reportDate = report?.oldPublishedAt || report?.publishedAt;
   let formattedDate = ''; // Default value

   if (reportDate) {
      try {
         const dateObject = new Date(reportDate);

         // Important: Check if the date is valid after parsing
         if (!isNaN(dateObject.getTime())) {
            formattedDate = dateObject.toLocaleDateString(locale, {
               // <<< PASS LOCALE HERE
               year: 'numeric',
               month: 'long',
               day: 'numeric',
            });
         } else {
            console.warn(
               `Invalid date encountered for report ${report?.slug}:`,
               reportDate,
            );
            // Optionally set a placeholder or leave empty
            // formattedDate = 'N/A';
         }
      } catch (error) {
         console.error(
            `Error formatting date for report ${report?.slug}:`,
            reportDate,
            error,
         );
         // Handle potential errors during Date creation or formatting
      }
   }

   return formattedDate;
}
