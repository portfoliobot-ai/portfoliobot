import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageFallbackProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className: string;
  width: number;
  height: number;
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function ImageWithFallback({ src, alt, fallbackSrc, className, width, height, ...rest }: ImageFallbackProps) {
  const [imgSrc, set_imgSrc] = useState(src);

  useEffect(() => {
    set_imgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      className={className}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          set_imgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        set_imgSrc(fallbackSrc);
      }}
      width={24}
      height={24}
    />
  );
}