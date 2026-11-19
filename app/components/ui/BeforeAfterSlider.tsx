
"use client";

import Image from "next/image";
import { useState, useRef } from "react";

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  title: string;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;

    setPosition(Math.min(100, Math.max(0, newPosition)));
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    isDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging.current) return;
    updatePosition(event.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 select-none touch-pan-y"
      >
        {/* Final Render */}
        <Image
          src={afterImage}
          alt={`${title} - Final Render`}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
          priority
        />

        {/* Wireframe */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div className="relative h-full w-full">
            <Image
              src={beforeImage}
              alt={`${title} - Wireframe`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-4 left-4 z-20 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white pointer-events-none">
          WIREFRAME
        </span>

        <span className="absolute top-4 right-4 z-20 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white pointer-events-none">
          FINAL RENDER
        </span>

        {/* Draggable Divider */}
        <div
          className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Handle */}
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white text-xl font-bold text-black shadow-xl cursor-ew-resize">
            ↔
          </div>
        </div>

        {/* Click anywhere to move divider */}
        <div
          className="absolute inset-0 z-10 cursor-ew-resize"
          onPointerDown={(event) => {
            updatePosition(event.clientX);
          }}
        />
      </div>

      {/* Slider control */}
      <div className="mt-5 flex items-center gap-4">
        <span className="text-xs font-semibold text-neutral-500">
          WIREFRAME
        </span>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Compare wireframe and final render"
          className="h-2 flex-1 cursor-ew-resize accent-blue-500"
        />

        <span className="text-xs font-semibold text-neutral-500">
          FINAL
        </span>
      </div>

      <p className="mt-2 text-center text-xs text-neutral-500">
        {Math.round(position)}% Wireframe
      </p>
    </div>
  );
}
