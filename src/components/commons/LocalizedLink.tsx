import { DEFAULT_LOCALE } from '@/utils/constants';
import Link from 'next/link';

// Remove the 'use client' directive
type LocalizedLinkProps = {
   href: string;
   children: React.ReactNode;
   lang?: string;
   className?: string;
   [key: string]: any;
};

export function getLocalizedPath(
   path: string,
   locale: string | null | undefined,
) {
   // If no locale or it's the default locale, return path as is
   if (!locale || locale === DEFAULT_LOCALE) {
      return path;
   }

   // Check if path already starts with the locale
   if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return path;
   }

   // Add locale to the path
   return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}

export function LocalizedLink({
   href,
   children,
   lang, // Accept lang as a prop instead of using useParams
   ...props
}: LocalizedLinkProps) {
   const localizedHref = getLocalizedPath(href, lang);

   return (
      <Link href={localizedHref} {...props}>
         {children}
      </Link>
   );
}
