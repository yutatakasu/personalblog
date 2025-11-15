"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type NewsThumbnailProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackAspectRatio?: number;
};

export function NewsThumbnail({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  fallbackAspectRatio,
}: NewsThumbnailProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const prevSrcRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevSrcRef.current === src) {
      return;
    }

    prevSrcRef.current = src;
    setAspectRatio(null);
  }, [src]);

  const computedAspectRatio = aspectRatio ?? fallbackAspectRatio;

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={
        computedAspectRatio ? { aspectRatio: computedAspectRatio } : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`h-full w-full object-contain ${imageClassName ?? ""}`}
        onLoadingComplete={(result) => {
          if (result.naturalHeight > 0) {
            setAspectRatio(result.naturalWidth / result.naturalHeight);
          }
        }}
      />
    </div>
  );
}
