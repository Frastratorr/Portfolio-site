
"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  title: string;
  value: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
};

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
      setError("Можно загружать только изображения.");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      setError("Можно добавить только одно изображение.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          throw new Error(data.error || `Ошибка загрузки ${file.name}`);
        }

        uploadedUrls.push(data.url);
      }

      onChange(multiple ? [...value, ...uploadedUrls] : uploadedUrls);
    } catch (err) {
      console.error("Image upload error:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки изображений."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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
            ? "Добавляй несколько изображений и меняй их порядок перетаскиванием."
            : "Добавь одно изображение."}
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
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
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
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
          }}
        />

        <div className="text-3xl mb-3">📁</div>

        <p className="font-semibold">
          {uploading
            ? "Загрузка изображений..."
            : dragging
              ? "Отпусти изображения здесь"
              : "Перетащи изображения сюда"}
        </p>

        <p className="text-sm text-neutral-500 mt-2">
          или нажми, чтобы выбрать файлы
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
                aria-label="Удалить изображение"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Загружено изображений: {value.length}
      </p>
    </section>
  );
}
