
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "../../../components/ui/ImageLoader";
import ProjectMetadataFields from "../../../components/ui/ProjectMetadataFields";

type ProjectData = {
  slug: string;
  title: string;
  description: string;
  modelPath: string;
  previewImage: string | null;
  gallery: string[];
  processImages: string[];
  category: string;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
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

  const [seoData, setSeoData] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  });

  const [category, setCategory] = useState("Props");
  const [tags, setTags] = useState<string[]>([]);

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [processImages, setProcessImages] = useState<string[]>([]);

  const inputClass =
    "w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500";

  const updateSeoData = (
    field: keyof typeof seoData,
    value: string
  ) => {
    setSeoData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load project.");
        }

        const data: ProjectData = await response.json();

        if (!active) return;

        setFormData({
          slug: data.slug,
          title: data.title,
          description: data.description,
        });

        setSeoData({
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: Array.isArray(data.seoKeywords)
            ? data.seoKeywords.join(", ")
            : "",
          ogTitle: data.ogTitle || "",
          ogDescription: data.ogDescription || "",
          ogImage: data.ogImage || "",
          canonicalUrl: data.canonicalUrl || "",
        });

        setCategory(data.category || "Props");
        setTags(Array.isArray(data.tags) ? data.tags : []);

        setPreviewImage(
          data.previewImage ? [data.previewImage] : []
        );

        setGallery(data.gallery || []);
        setProcessImages(data.processImages || []);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load project."
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
          category,
          tags,

          seoTitle: seoData.seoTitle.trim() || null,
          seoDescription: seoData.seoDescription.trim() || null,
          seoKeywords: seoData.seoKeywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          ogTitle: seoData.ogTitle.trim() || null,
          ogDescription: seoData.ogDescription.trim() || null,
          ogImage: seoData.ogImage.trim() || null,
          canonicalUrl: seoData.canonicalUrl.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save project.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Update project error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not save project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading project...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        Edit Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-neutral-100 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Slug
          </label>
          <input
            type="text"
            required
            className={inputClass}
            value={formData.slug}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            required
            className={inputClass}
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
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
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        <ProjectMetadataFields
          category={category}
          tags={tags}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
        />

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold">
              SEO Settings
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Leave fields empty to use default project information.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Title
            </label>
            <input
              type="text"
              maxLength={70}
              className={inputClass}
              placeholder="Custom search engine title"
              value={seoData.seoTitle}
              onChange={(e) =>
                updateSeoData("seoTitle", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Description
            </label>
            <textarea
              maxLength={200}
              className={`${inputClass} h-24`}
              placeholder="Custom search engine description"
              value={seoData.seoDescription}
              onChange={(e) =>
                updateSeoData("seoDescription", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Keywords
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="3D modeling, Blender, hard surface"
              value={seoData.seoKeywords}
              onChange={(e) =>
                updateSeoData("seoKeywords", e.target.value)
              }
            />
            <p className="text-xs text-neutral-500 mt-1">
              Separate keywords with commas.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Open Graph Title
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Title displayed when sharing"
              value={seoData.ogTitle}
              onChange={(e) =>
                updateSeoData("ogTitle", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Open Graph Description
            </label>
            <textarea
              className={`${inputClass} h-24`}
              placeholder="Description displayed when sharing"
              value={seoData.ogDescription}
              onChange={(e) =>
                updateSeoData("ogDescription", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Open Graph Image URL
            </label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://example.com/image.jpg"
              value={seoData.ogImage}
              onChange={(e) =>
                updateSeoData("ogImage", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Canonical URL
            </label>
            <input
              type="url"
              className={inputClass}
              placeholder="https://example.com/projects/project-slug"
              value={seoData.canonicalUrl}
              onChange={(e) =>
                updateSeoData("canonicalUrl", e.target.value)
              }
            />
          </div>
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
              New model: {modelFile.name}
            </p>
          )}

          <p className="text-xs text-neutral-500 mt-2">
            If no file is selected, the current 3D model will remain unchanged.
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
      <Suspense
        fallback={
          <div className="p-8 text-center">
            Loading form...
          </div>
        }
      >
        <EditForm />
      </Suspense>
    </main>
  );
}
