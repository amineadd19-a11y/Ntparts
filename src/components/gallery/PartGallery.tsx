'use client';

import { PartImage as PartImageType } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, ZoomIn } from 'lucide-react';

interface PartGalleryProps {
  images: PartImageType[];
  partName: string;
}

export default function PartGallery({ images, partName }: PartGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images?.length) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Package size={28} className="text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-600">No real product photo</p>
        <p className="mt-1 max-w-xs text-center text-xs text-slate-400">
          Only official manufacturer catalogue photos are shown. No stock or placeholder images.
        </p>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-lg bg-slate-50 ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
      >
        <div className="relative h-96 w-full">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || partName}
            fill
            className="object-contain p-4"
            priority
            unoptimized
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
          aria-label="Toggle zoom"
        >
          <ZoomIn size={20} />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded border-2 transition ${
                index === currentIndex ? 'border-sky-600' : 'border-slate-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-contain p-1" unoptimized />
            </button>
          ))}
        </div>
      )}
      {currentImage.source && (
        <p className="text-xs text-slate-500">Photo source: {currentImage.source}</p>
      )}
    </div>
  );
}
