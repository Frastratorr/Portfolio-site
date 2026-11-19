"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

function EditForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ slug: "", title: "", description: "" });

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({ slug: data.slug, title: data.title, description: data.description });
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      alert("Ошибка при сохранении");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-100 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input type="text" required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea required className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 h-32" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50">
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