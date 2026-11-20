
"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  title: string;
  value: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
};

type UploadResult = {
  url: string;
  pathname: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savingsPercent: number;
  optimized: boolean;
  contentType: string;
  width: number | null;
  height: number | null;
};

type OptimizationResult = {
  name: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savingsPercent: number;
  contentType: string;
  width: number | null;
  height: number | null;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUploader({
  title,
  value,
  onChange,
  multiple = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [results, setResults] = useState<OptimizationResult[]>([]);

  const uploadFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files);

    if (!selected.length) return;

    const validFiles = selected.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf")
    );

    if (validFiles.length !== selected.length) {
      setError("Unsupported file type.");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      setError("Only one image can be uploaded.");
      return;
    }

    setError("");
    setResults([]);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      const optimizationResults: OptimizationResult[] = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          throw new Error(data.error || `Upload failed: ${file.name}`);
        }

        const result = data as UploadResult;

        uploadedUrls.push(result.url);

        if (result.optimized) {
          optimizationResults.push({
            name: file.name,
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            savedBytes: result.savedBytes,
            savingsPercent: result.savingsPercent,
            contentType: result.contentType,
            width: result.width,
            height: result.height,
          });
        }
      }

      onChange(
        multiple
          ? [...value, ...uploadedUrls]
          : uploadedUrls
      );

      setResults(optimizationResults);
    } catch (err) {
      console.error("Image upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (from === to) return;

    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    onChange(updated);
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>

        <p className="text-sm text-neutral-500 mt-1">
          {multiple
            ? "Add multiple images and reorder them by dragging."
            : "Add one image."}
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!uploading) inputRef.current?.click();
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
        } ${uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.glb,.gltf"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files) {
              void uploadFiles(e.target.files);
            }
          }}
        />

        <div className="text-3xl mb-3">📁</div>

        <p className="font-semibold">
          {uploading
            ? "Uploading and optimizing..."
            : dragging
              ? "Drop files here"
              : "Drag files here"}
        </p>

        <p className="text-sm text-neutral-500 mt-2">
          Or click to select files
        </p>

        {uploading && (
          <div className="mt-4 w-full h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-blue-500 animate-pulse rounded-full" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Image Optimization Results</h4>

          {results.map((result, index) => (
            <div
              key={`${result.name}-${index}`}
              className="rounded-xl border border-neutral-300 dark:border-neutral-700 p-4 space-y-3"
            >
              <div className="flex justify-between gap-3">
                <p className="font-medium text-sm truncate">
                  {result.name}
                </p>

                <span className="text-xs text-green-600 font-semibold shrink-0">
                  {result.savingsPercent}% saved
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-neutral-500">
                    Original Size
                  </p>
                  <p className="font-semibold">
                    {formatFileSize(result.originalSize)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Optimized Size
                  </p>
                  <p className="font-semibold text-green-600">
                    {formatFileSize(result.optimizedSize)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Space Saved
                  </p>
                  <p className="font-semibold">
                    {formatFileSize(result.savedBytes)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Output Format
                  </p>
                  <p className="font-semibold">
                    {result.contentType.replace("image/", "").toUpperCase()}
                  </p>
                </div>
              </div>

              {result.width && result.height && (
                <p className="text-xs text-neutral-500">
                  Resolution: {result.width} × {result.height}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();

                if (dragIndex !== null) {
                  moveImage(dragIndex, index);
                }

                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`relative group aspect-square rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 cursor-grab active:cursor-grabbing ${
                dragIndex === index ? "opacity-40" : ""
              }`}
            >
              <Image
                src={url}
                alt={`${title} ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs p-2 flex justify-between items-center">
                <span>#{index + 1}</span>
                <span>↕ Drag</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Uploaded images: {value.length}
      </p>
    </section>
  );
}
