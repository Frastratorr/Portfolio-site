
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

  // Переключение Draft / Published
  const handlePublishToggle = async (project: Project) => {
    const newStatus = !project.isPublished;

    try {
      setUpdatingId(project.id);

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: newStatus,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Не удалось изменить статус");
      }

      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id
            ? { ...item, isPublished: data.isPublished }
            : item
        )
      );

      router.refresh();
    } catch (err) {
      console.error("Publishing status error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Ошибка изменения статуса"
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при удалении");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));

      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Ошибка при удалении"
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
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-neutral-500 mt-2">
              Manage your portfolio projects
            </p>
          </div>

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

        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto">

          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">

              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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

                    <td className="p-4">
                      <button
                        onClick={() => handlePublishToggle(project)}
                        disabled={updatingId === project.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-wait ${
                          project.isPublished
                            ? "bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20"
                        }`}
                      >
                        {updatingId === project.id
                          ? "Updating..."
                          : project.isPublished
                            ? "Published"
                            : "Draft"}
                      </button>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-4">
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

        <div className="flex flex-wrap gap-6 mt-6 text-sm text-neutral-500">
          <p>
            Total projects: {projects.length}
          </p>

          <p>
            Published: {projects.filter((p) => p.isPublished).length}
          </p>

          <p>
            Drafts: {projects.filter((p) => !p.isPublished).length}
          </p>
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
