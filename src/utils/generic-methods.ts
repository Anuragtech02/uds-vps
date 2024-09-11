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
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      url.search = ctaUrl;
      return url.href;
   } else if (ctaUrl.startsWith('/')) {
      return `${ctaUrl}`;
   } else {
      return `/${ctaUrl}`;
   }
}
