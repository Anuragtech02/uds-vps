import Image, { ImageProps } from 'next/image';

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
   extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
   media: Media | null;
   alt?: string;
}

const StrapiImage: React.FC<StrapiImageProps> = ({ media, alt, ...props }) => {
   if (!media) return null;

   const { url, alternativeText, formats, width, height } = media;

   // Choose the best format based on screen size or props
   const imageUrl = url || formats?.small?.url || url;

   return (
      <Image
         src={imageUrl}
         alt={alt || alternativeText || 'Strapi Image'}
         layout='responsive'
         width={width}
         height={height}
         {...props}
      />
   );
};

export default StrapiImage;
