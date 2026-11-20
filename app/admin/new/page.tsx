
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../../components/ui/ImageLoader";
import ProjectMetadataFields from "../../components/ui/ProjectMetadataFields";
import { analyzeGLB } from "../../lib/AnalyzeGLB";

export default function NewProjectPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");

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

  const [technicalData, setTechnicalData] = useState({
    polygonCount: "",
    triangleCount: "",
    textureResolution: "",
    softwareUsed: "",
    modelingTime: "",
  });

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [processImages, setProcessImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const inputClass =
    "w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500";

  const updateTechnicalData = (
    field: keyof typeof technicalData,
    value: string
  ) => {
    setTechnicalData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateSeoData = (
    field: keyof typeof seoData,
    value: string
  ) => {
    setSeoData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleModelChange = async (file: File | null) => {
    setModelFile(file);
    setAnalysisStatus("");
    setError("");

    setTechnicalData((previous) => ({
      ...previous,
      triangleCount: "",
      textureResolution: "",
    }));

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".glb")) {
      setAnalysisStatus(
        "Automatic analysis currently supports GLB files only."
      );
      return;
    }

    setAnalyzing(true);
    setAnalysisStatus("Analyzing 3D model...");

    try {
      const result = await analyzeGLB(file);

      setTechnicalData((previous) => ({
        ...previous,
        triangleCount: String(result.triangleCount),
        textureResolution: result.textureResolution,
      }));

      setAnalysisStatus(
        `Analysis complete. ${result.triangleCount.toLocaleString("en-US")} triangles found.`
      );

      if (result.generator) {
        console.info("GLB exporter:", result.generator);
      }
    } catch (err) {
      console.error("GLB analysis error:", err);

      setAnalysisStatus(
        "Could not analyze this GLB file. You can enter the values manually."
      );
    } finally {
      setAnalyzing(false);
    }
  };

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

    if (!modelFile) {
      setError("Please select a 3D model.");
      return;
    }

    if (analyzing) {
      setError("Please wait until model analysis is complete.");
      return;
    }

    if (previewImage.length === 0) {
      setError("Please add the main project image.");
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
          category,
          tags,

          polygonCount: technicalData.polygonCount,
          triangleCount: technicalData.triangleCount,
          textureResolution: technicalData.textureResolution,
          softwareUsed: technicalData.softwareUsed
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          modelingTime: technicalData.modelingTime,

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
        throw new Error(
          result.error || "Could not create project."
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Create project error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Add New Project
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
              3D Model (.glb)
            </label>

            <input
              type="file"
              accept=".glb,.gltf"
              required
              onChange={(e) =>
                handleModelChange(e.target.files?.[0] || null)
              }
              className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700"
            />

            {modelFile && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {modelFile.name}
              </p>
            )}

            {analysisStatus && (
              <p
                className={`text-sm mt-2 ${
                  analyzing ? "text-blue-500" : "text-green-600"
                }`}
              >
                {analysisStatus}
              </p>
            )}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold">
                Technical Breakdown
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Some values are calculated automatically from your GLB file.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Polygon Count
              </label>
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="Enter polygon count manually"
                value={technicalData.polygonCount}
                onChange={(e) =>
                  updateTechnicalData("polygonCount", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Triangle Count
              </label>
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="Automatically calculated"
                value={technicalData.triangleCount}
                onChange={(e) =>
                  updateTechnicalData("triangleCount", e.target.value)
                }
              />
              <p className="text-xs text-neutral-500 mt-1">
                Calculated from mesh geometry. You can edit it if needed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Texture Resolution
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Automatically detected"
                value={technicalData.textureResolution}
                onChange={(e) =>
                  updateTechnicalData("textureResolution", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Software Used
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Blender, Substance Painter"
                value={technicalData.softwareUsed}
                onChange={(e) =>
                  updateTechnicalData("softwareUsed", e.target.value)
                }
              />
              <p className="text-xs text-neutral-500 mt-1">
                Separate multiple programs with commas.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Modeling Time
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. 12 hours"
                value={technicalData.modelingTime}
                onChange={(e) =>
                  updateTechnicalData("modelingTime", e.target.value)
                }
              />
            </div>
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
            disabled={loading || analyzing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? "Uploading and saving..."
              : analyzing
                ? "Analyzing model..."
                : "Add Project"}
          </button>
        </form>
      </div>
    </main>
  );
}
