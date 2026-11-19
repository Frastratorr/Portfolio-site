
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function Gallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeGallery = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "Escape") {
        closeGallery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, showNext, showPrevious, closeGallery]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            aria-label={`Open render ${idx + 1}`}
            className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:opacity-80 transition-opacity"
            onClick={() => setSelectedIndex(idx)}
          >
            <Image
              src={img}
              alt={`Render ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Gallery */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          {/* Close Button */}
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute top-6 right-6 z-50 text-white text-4xl hover:text-neutral-400 transition-colors"
            onClick={closeGallery}
          >
            &times;
          </button>

          {/* Image Counter */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-white text-sm tracking-widest">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/25 text-white text-3xl transition-colors backdrop-blur-sm"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
            >
              &#8249;
            </button>
          )}

          {/* Current Image */}
          <div
            className="relative w-full max-w-7xl h-[75vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={images[selectedIndex]}
              src={images[selectedIndex]}
              alt={`Render ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/25 text-white text-3xl transition-colors backdrop-blur-sm"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              &#8250;
            </button>
          )}

          {/* Bottom Hint */}
          <div className="absolute bottom-6 text-neutral-400 text-xs tracking-wider">
            Use ← → to navigate · ESC to close
          </div>
        </div>
      )}
    </>
  );
}
