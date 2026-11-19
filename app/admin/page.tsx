
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Получение проектов
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Не удалось загрузить проекты");
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError("Ошибка загрузки проектов. Попробуйте обновить страницу.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Удаление проекта
  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Вы уверены, что хотите удалить этот проект?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка при удалении");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));

      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        err instanceof Error ? err.message : "Ошибка при удалении"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-black dark:text-white min-h-screen bg-white dark:bg-neutral-950">
        Загрузка...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          <Link
            href="/admin/new"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-colors"
          >
            + Add New Project
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
            {error}

            <button
              onClick={fetchProjects}
              className="ml-3 underline font-bold"
            >
              Повторить
            </button>
          </div>
        )}

        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">

          <table className="w-full text-left">
            <thead className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">

              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-neutral-500"
                  >
                    Проектов пока нет.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      {project.title}
                    </td>

                    <td className="p-4 text-neutral-500 dark:text-neutral-400">
                      /{project.slug}
                    </td>

                    <td className="p-4 text-neutral-500 dark:text-neutral-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right space-x-4">
                      <Link
                        href={`/admin/edit/${project.id}`}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        <button
          onClick={fetchProjects}
          className="mt-6 text-sm text-blue-500 hover:text-blue-400"
        >
          Обновить список проектов
        </button>

      </div>
    </main>
  );
}
