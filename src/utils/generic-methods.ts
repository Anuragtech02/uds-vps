export const buildPopulateQuery = (fields: string[]): string => {
   if (!fields || fields.length === 0) {
      return '';
   }

   // Convert the array into a string format that Strapi expects for populate
   const populateString = fields
      .map((field, i) => `populate[${i}]=${field}`)
      .join('&');

   return `?${populateString}`;
};
