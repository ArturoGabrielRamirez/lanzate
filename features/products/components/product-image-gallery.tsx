/**
 * Product Image Gallery Component
 *
 * Interactive gallery for displaying product images with zoom functionality.
 * Uses React 19 hooks for state management and image handling.
 *
 * Features:
 * - Main image display with click-to-zoom
 * - Thumbnail strip for multiple images
 * - Touch/swipe support for mobile
 * - Keyboard navigation
 */

"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback } from 'react';

import type { ProductImageGalleryProps } from '@/features/products/types/product-detail.types';

/**
 * Product image gallery with main display and thumbnails
 */
export function ProductImageGallery({ 
  images, 
  productName, 
  className = "" 
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectedImage = images[selectedImageIndex];

  const handlePrevious = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handleMainImageClick = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleZoomClose = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isZoomed) {
      setIsZoomed(false);
    }
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
    if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [isZoomed, handlePrevious, handleNext]);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square w-full overflow-hidden rounded-lg bg-muted ${className}`}>
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl text-muted-foreground/50">
            {productName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      {/* Main Image Display */}
      <div 
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted cursor-zoom-in"
        onClick={handleMainImageClick}
        role="button"
        tabIndex={0}
        aria-label={`Ver imagen ampliada de ${productName}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleMainImageClick();
          }
        }}
      >
        {selectedImage ? (
          <>
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productName}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              priority={selectedImageIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Zoom Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        ) : null}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/20'
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
              aria-current={selectedImageIndex === index}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productName} - Imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleZoomClose}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <div className="relative max-w-90vw max-h-90vh">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productName}
              width={1200}
              height={1200}
              className="max-h-full max-w-full object-contain"
              priority
            />
            <button
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              onClick={handleZoomClose}
              aria-label="Cerrar imagen ampliada"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}