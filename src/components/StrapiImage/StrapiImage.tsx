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
}

const StrapiImage: React.FC<StrapiImageProps> = ({
   media,
   size = 'original',
   alt,
   objectFit,
   width: propWidth,
   height: propHeight,
   wrapperClassName,
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

   return (
      <div style={containerStyle} className={wrapperClassName}>
         <Image
            src={imageUrl}
            alt={alt || alternativeText || 'Image'}
            width={Number(propWidth) || imageWidth}
            height={Number(propHeight) || imageHeight}
            style={imageStyle}
            unoptimized // Skip Next.js image optimization
            {...props}
         />
      </div>
   );
};

export default StrapiImage;
