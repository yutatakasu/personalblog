"use client";

import Image from "next/image";

type NewsThumbnailProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  aspectRatio?: number;
};

const DEFAULT_ASPECT_RATIO = 16 / 9;

export function NewsThumbnail({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: NewsThumbnailProps) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`h-full w-full object-cover ${imageClassName ?? ""}`}
      />
    </div>
  );
}
