
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
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updatePosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const newPosition =
      ((clientX - rect.left) / rect.width) * 100;

    setPosition(Math.min(100, Math.max(0, newPosition)));
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    isDraggingRef.current = true;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDraggingRef.current) return;

    updatePosition(event.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPosition(Number(event.target.value));
  };

  return (
    <div className="w-full">

      {/* Comparison Container */}
      <div
        ref={containerRef}
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 select-none ${
          isDragging ? "cursor-ew-resize" : "cursor-col-resize"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          touchAction: "pan-y",
        }}
      >

        {/* Final Render */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={`${title} - Final Render`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover pointer-events-none"
            priority
            draggable={false}
          />
        </div>

        {/* Wireframe */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <Image
            src={beforeImage}
            alt={`${title} - Wireframe`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/65 backdrop-blur-md px-4 py-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] text-white">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            WIREFRAME
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/65 backdrop-blur-md px-4 py-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] text-white">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            FINAL RENDER
          </span>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-30 w-[2px] bg-white pointer-events-none"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
          }}
        >

          {/* Handle */}
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 sm:h-14 sm:w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-blue-600 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1">
              <span className="text-lg leading-none">‹</span>
              <span className="text-lg leading-none">›</span>
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-4 py-2 text-[10px] sm:text-xs font-medium tracking-wide text-white/80 whitespace-nowrap">
            DRAG TO COMPARE
          </span>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="mt-6 flex items-center gap-4">

        <span className="text-[10px] sm:text-xs font-bold tracking-wider text-neutral-500 whitespace-nowrap">
          WIREFRAME
        </span>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          onChange={handleSliderChange}
          aria-label="Compare wireframe and final render"
          className="h-1.5 flex-1 cursor-ew-resize appearance-none rounded-full bg-neutral-800 accent-blue-500"
        />

        <span className="text-[10px] sm:text-xs font-bold tracking-wider text-neutral-500 whitespace-nowrap">
          FINAL
        </span>

      </div>

      {/* Position Indicator */}
      <div className="mt-3 flex justify-center">
        <p className="text-xs text-neutral-500">
          <span className="font-semibold text-blue-500">
            {Math.round(position)}%
          </span>{" "}
          Wireframe
          <span className="mx-2 text-neutral-700">/</span>
          <span className="font-semibold text-green-500">
            {Math.round(100 - position)}%
          </span>{" "}
          Final Render
        </p>
      </div>

    </div>
  );
}
