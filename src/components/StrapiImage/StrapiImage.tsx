import Image, { ImageProps } from 'next/image';
import React from 'react';

interface MediaFormat {
   url: string;
   width: number;
   height: number;
}

interface Media {
   url: string;
   alternativeText?: string;
   formats?: {
      thumbnail?: MediaFormat;
      small?: MediaFormat;
      medium?: MediaFormat;
      large?: MediaFormat;
   };
   width: number;
   height: number;
}

interface StrapiImageProps
   extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'fill'> {
   media: Media | null;
   alt?: string;
   objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
   width?: number | string;
   height?: number | string;
}

const StrapiImage: React.FC<StrapiImageProps> = ({
   media,
   alt,
   objectFit,
   width: propWidth,
   height: propHeight,
   ...props
}) => {
   if (!media) return null;

   const {
      url,
      alternativeText,
      formats,
      width: mediaWidth,
      height: mediaHeight,
   } = media;

   // Choose the best format based on screen size or props
   const imageUrl = formats?.small?.url || url;

   const usesFillLayout = objectFit === 'fill' || objectFit === 'cover';

   const imageStyle: React.CSSProperties = usesFillLayout
      ? { objectFit }
      : { width: '100%', height: 'auto' };

   const containerStyle: React.CSSProperties = usesFillLayout
      ? {
           position: 'relative',
           width: propWidth || '100%',
           height: propHeight || '100%',
        }
      : {};

   return (
      <div style={containerStyle}>
         <Image
            src={imageUrl}
            alt={alt || alternativeText || 'Strapi Image'}
            {...(usesFillLayout
               ? { fill: true }
               : { width: mediaWidth, height: mediaHeight })}
            style={imageStyle}
            {...props}
         />
      </div>
   );
};

export default StrapiImage;
