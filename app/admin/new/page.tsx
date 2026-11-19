
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../../components/ui/ImageLoader";

export default function NewProjectPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
  });

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [processImages, setProcessImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok || !result.url) {
      throw new Error(result.error || "File upload failed");
    }

    return result.url as string;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!modelFile) {
      setError("Пожалуйста, выбери 3D-модель.");
      return;
    }

    if (previewImage.length === 0) {
      setError("Пожалуйста, добавь главное изображение проекта.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const modelPath = await uploadFile(modelFile);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          modelPath,
          previewImage: previewImage[0],
          gallery,
          processImages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не удалось создать проект.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Create project error:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка при создании проекта."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add New Project</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-neutral-100 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              required
              className={inputClass}
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              required
              className={inputClass}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              required
              className={`${inputClass} h-32`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              3D Model (.glb)
            </label>

            <input
              type="file"
              accept=".glb,.gltf"
              required
              onChange={(e) =>
                setModelFile(e.target.files?.[0] || null)
              }
              className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700"
            />

            {modelFile && (
              <p className="text-sm text-green-600 mt-2">
                Выбрано: {modelFile.name}
              </p>
            )}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <ImageUploader
              title="Main Preview"
              value={previewImage}
              onChange={setPreviewImage}
              multiple={false}
            />
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <ImageUploader
              title="Render Gallery"
              value={gallery}
              onChange={setGallery}
            />
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <ImageUploader
              title="Creation Process"
              value={processImages}
              onChange={setProcessImages}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Uploading and saving..." : "Add Project"}
          </button>
        </form>
      </div>
    </main>
  );
}
