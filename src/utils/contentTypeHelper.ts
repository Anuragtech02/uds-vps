// utils/contentTypeHelpers.ts
// Helper functions to determine what fields are available for each content type

export const CONTENT_TYPES = {
   REPORTS: 'reports',
   BLOGS: 'blogs',
   NEWS: 'news',
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// Check if a content type supports geographies
export const supportsGeographies = (
   contentType: ContentType | string,
): boolean => {
   return contentType === CONTENT_TYPES.REPORTS;
};

// Check if a content type supports industries (all do currently)
export const supportsIndustries = (
   contentType: ContentType | string,
): boolean => {
   return true; // All content types currently support industries
};

// Get entity type from tab name
export const getEntityFromTab = (tab: ContentType | string): string => {
   switch (tab) {
      case CONTENT_TYPES.REPORTS:
         return 'api::report.report';
      case CONTENT_TYPES.BLOGS:
         return 'api::blog.blog';
      case CONTENT_TYPES.NEWS:
         return 'api::news-article.news-article';
      default:
         return 'api::report.report'; // Default fallback
   }
};

// Get tab name from entity type
export const getTabFromEntity = (entity: string): ContentType => {
   switch (entity) {
      case 'api::report.report':
         return CONTENT_TYPES.REPORTS;
      case 'api::blog.blog':
         return CONTENT_TYPES.BLOGS;
      case 'api::news-article.news-article':
         return CONTENT_TYPES.NEWS;
      default:
         return CONTENT_TYPES.REPORTS; // Default fallback
   }
};

// Get display name for content type
export const getContentTypeDisplayName = (
   contentType: ContentType | string,
): string => {
   switch (contentType) {
      case CONTENT_TYPES.REPORTS:
         return 'Reports';
      case CONTENT_TYPES.BLOGS:
         return 'Blogs';
      case CONTENT_TYPES.NEWS:
         return 'News';
      default:
         return 'Content';
   }
};

// Get available filter fields for a content type
export const getAvailableFilters = (
   contentType: ContentType | string,
): string[] => {
   const filters = ['industries']; // All content types have industries

   if (supportsGeographies(contentType)) {
      filters.push('geographies');
   }

   return filters;
};
