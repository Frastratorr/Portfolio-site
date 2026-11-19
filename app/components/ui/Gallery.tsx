"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(img)}
          >
            <Image 
              src={img} 
              alt={`Render ${idx + 1}`} 
              fill 
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Модальное окно для полноэкранного просмотра */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-7xl aspect-video">
            <Image 
              src={selectedImage} 
              alt="Full screen render" 
              fill 
              className="object-contain"
            />
          </div>
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-neutral-400"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}