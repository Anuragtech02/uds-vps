import Image, { ImageProps } from 'next/image';
import React from 'react';

interface MediaFormat {
   url: string;
   width: number;
   height: number;
}

export interface Media {
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
   size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
   alt?: string;
   objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
   width?: number | string;
   height?: number | string;
   wrapperClassName?: string;
   priority?: boolean;
}

const StrapiImage: React.FC<StrapiImageProps> = ({
   media,
   size = 'original',
   alt,
   objectFit,
   width: propWidth,
   height: propHeight,
   wrapperClassName,
   priority,
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

   // Get the appropriate format or fallback to original
   const getImageData = () => {
      if (size === 'original') {
         return {
            url,
            width: mediaWidth,
            height: mediaHeight,
         };
      }

      const format = formats?.[size];
      return (
         format || {
            url,
            width: mediaWidth,
            height: mediaHeight,
         }
      );
   };

   const {
      url: imageUrl,
      width: imageWidth,
      height: imageHeight,
   } = getImageData();

   const usesFillLayout = objectFit === 'fill' || objectFit === 'cover';

   const imageStyle: React.CSSProperties = usesFillLayout
      ? { objectFit }
      : { width: '100%', height: 'auto' };

   const containerStyle: React.CSSProperties = usesFillLayout
      ? {
           position: 'relative',
           width: propWidth || '100%',
           height: propHeight || '100%',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
        }
      : {};

   function replaceWithCloudfrontURL(imageUrl: string) {
      if (!imageUrl) {
         return imageUrl;
      }
      const cloudfrontURL = 'd21aa2ghywi6oj.cloudfront.net';
      return imageUrl?.replace(
         'udsweb.s3.ap-south-1.amazonaws.com',
         cloudfrontURL,
      );
   }

   return (
      <div style={containerStyle} className={wrapperClassName}>
         <Image
            src={replaceWithCloudfrontURL(imageUrl)}
            alt={alt || alternativeText || 'Image'}
            width={Number(propWidth) || imageWidth}
            height={Number(propHeight) || imageHeight}
            style={imageStyle}
            priority={priority}
            {...props}
         />
      </div>
   );
};

export default StrapiImage;
