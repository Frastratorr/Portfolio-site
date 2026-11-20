
"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  title: string;
  value: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
};

const MAX_IMAGE_SIZE = 2000;
const WEBP_QUALITY = 0.82;

async function optimizeImage(file: File): Promise<File> {
  // Preserve SVG files and animated GIFs.
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(
      1,
      MAX_IMAGE_SIZE / Math.max(bitmap.width, bitmap.height)
    );

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const optimizedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
    });

    if (!optimizedBlob) {
      return file;
    }

    // Keep the original if WebP conversion does not reduce file size.
    if (optimizedBlob.size >= file.size) {
      return file;
    }

    const optimizedName = file.name.replace(/\.[^.]+$/, "") + ".webp";

    return new File([optimizedBlob], optimizedName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn("Image optimization failed. Uploading original file.", error);
    return file;
  }
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

  const uploadFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files);

    if (!selected.length) return;

    const validFiles = selected.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selected.length) {
      setError("Only image files are allowed.");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      setError("Only one image can be uploaded.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const originalFile of validFiles) {
        // Optimize the image before uploading.
        const optimizedFile = await optimizeImage(originalFile);

        const formData = new FormData();
        formData.append("file", optimizedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          throw new Error(
            data.error || `Failed to upload ${originalFile.name}`
          );
        }

        uploadedUrls.push(data.url);
      }

      onChange(
        multiple
          ? [...value, ...uploadedUrls]
          : uploadedUrls
      );
    } catch (err) {
      console.error("Image upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload images."
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
            ? "Upload multiple images and reorder them by dragging."
            : "Upload one image."}
        </p>

        <p className="text-xs text-neutral-500 mt-1">
          Images are automatically optimized before uploading.
          Maximum dimension: 2000px.
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
          uploading
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        } ${
          dragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
            ? "Optimizing and uploading images..."
            : dragging
              ? "Drop images here"
              : "Drag and drop images here"}
        </p>

        <p className="text-sm text-neutral-500 mt-2">
          or click to select files
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
