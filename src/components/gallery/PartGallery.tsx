'use client';

import { PartImage as PartImageType } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface PartGalleryProps { images: PartImageType[]; partName: string; }

export default function PartGallery({ images, partName }: PartGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  if (!images?.length) return <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center h-96"><div className="text-center"><div className="text-6xl mb-4">📷</div><p className="text-gray-600">No images available</p></div></div>;
  const currentImage = images[currentIndex];
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  return <div className="space-y-4"><div className={`relative bg-gray-100 rounded-lg overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}><div className="relative w-full h-96"><Image src={currentImage.url} alt={currentImage.alt || partName} fill className="object-contain" priority /></div>{images.length > 1 && <><button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition" aria-label="Previous image"><ChevronLeft size={20} /></button><button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition" aria-label="Next image"><ChevronRight size={20} /></button></>}<button onClick={() => setIsZoomed(!isZoomed)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition" aria-label="Toggle zoom"><ZoomIn size={20} /></button>{images.length > 1 && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{currentIndex + 1} / {images.length}</div>}</div>{images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-2">{images.map((image, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`relative flex-shrink-0 w-20 h-20 rounded border-2 transition ${index === currentIndex ? 'border-blue-600' : 'border-gray-300'}`} aria-label={`View image ${index + 1}`}><Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover rounded" /></button>)}</div>}{currentImage.source && <p className="text-xs text-gray-500">Source: {currentImage.source}</p>}</div>;
}
