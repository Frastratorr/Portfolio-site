"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ slug: "", title: "", description: "" });
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!modelFile) return alert("Please select a 3D model");
    setLoading(true);

    try {
      const modelData = new FormData();
      modelData.append("file", modelFile);
      const modelRes = await fetch("/api/upload", { method: "POST", body: modelData });
      const { url: modelPath } = await modelRes.json();

      let previewImage = null;
      if (previewFile) {
        const previewData = new FormData();
        previewData.append("file", previewFile);
        const previewRes = await fetch("/api/upload", { method: "POST", body: previewData });
        const { url } = await previewRes.json();
        previewImage = url;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, modelPath, previewImage }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      alert("Error uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-100 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input type="text" required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input type="text" required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg h-32 border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">3D Model (.glb)</label>
            <input type="file" accept=".glb" required onChange={(e) => setModelFile(e.target.files?.[0] || null)} className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preview Image</label>
            <input type="file" accept="image/*" onChange={(e) => setPreviewFile(e.target.files?.[0] || null)} className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Add Project"}
          </button>
        </form>
      </div>
    </main>
  );
}