
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "../../../components/ui/ImageLoader";

type ProjectData = {
  slug: string;
  title: string;
  description: string;
  modelPath: string;
  previewImage: string | null;
  gallery: string[];
  processImages: string[];
};

function EditForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
  });

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [processImages, setProcessImages] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить проект.");
        }

        const data: ProjectData = await response.json();

        if (!active) return;

        setFormData({
          slug: data.slug,
          title: data.title,
          description: data.description,
        });

        setPreviewImage(data.previewImage ? [data.previewImage] : []);
        setGallery(data.gallery || []);
        setProcessImages(data.processImages || []);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Ошибка загрузки проекта."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [id]);

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

    setSaving(true);
    setError("");

    try {
      let modelPath: string | undefined;

      if (modelFile) {
        modelPath = await uploadFile(modelFile);
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(modelPath ? { modelPath } : {}),
          previewImage: previewImage[0] || null,
          gallery,
          processImages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка при сохранении.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Update project error:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка при сохранении проекта."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500";

  if (loading) {
    return <div className="p-8">Загрузка проекта...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Project</h1>

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
            Replace 3D Model (.glb)
          </label>

          <input
            type="file"
            accept=".glb,.gltf"
            onChange={(e) =>
              setModelFile(e.target.files?.[0] || null)
            }
            className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700"
          />

          {modelFile && (
            <p className="text-sm text-green-600 mt-2">
              Новая модель: {modelFile.name}
            </p>
          )}

          <p className="text-xs text-neutral-500 mt-2">
            Если не выбирать файл, текущая 3D-модель останется без изменений.
          </p>
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
          disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function EditProjectPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <Suspense fallback={<div className="p-8 text-center">Загрузка формы...</div>}>
        <EditForm />
      </Suspense>
    </main>
  );
}
