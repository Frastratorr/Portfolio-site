
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
  isFeatured: boolean;
  views: number;
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
        throw new Error("Failed to load projects");
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError("Failed to load projects. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
        throw new Error(data.error || "Failed to update status");
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
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFeaturedToggle = async (project: Project) => {
    const newStatus = !project.isFeatured;

    try {
      setUpdatingId(project.id);

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFeatured: newStatus,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to update Featured status");
      }

      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id
            ? { ...item, isFeatured: data.isFeatured }
            : item
        )
      );

      router.refresh();
    } catch (err) {
      console.error("Featured status error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update Featured status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const totalViews = projects.reduce(
    (total, project) => total + project.views,
    0
  );

  const mostViewedProjects = [...projects]
    .filter((project) => project.isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-8 text-black dark:text-white min-h-screen bg-white dark:bg-neutral-950">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-500 mt-2">
              Manage your portfolio projects
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/seo"
              className="px-6 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full font-bold transition-colors"
            >
              SEO Settings
            </Link>

            <Link
              href="/admin/new"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-colors"
            >
              + Add New Project
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
            {error}
            <button
              onClick={fetchProjects}
              className="ml-3 underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Project Statistics</h2>
            <p className="text-neutral-500 mt-1">
              Overview of your portfolio performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 mb-3">
                Total Views
              </p>
              <p className="text-3xl font-bold">
                {totalViews.toLocaleString("en-US")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 mb-3">
                Total Projects
              </p>
              <p className="text-3xl font-bold">
                {projects.length}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 mb-3">
                Published Projects
              </p>
              <p className="text-3xl font-bold text-green-500">
                {projects.filter((p) => p.isPublished).length}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 mb-3">
                Featured Projects
              </p>
              <p className="text-3xl font-bold text-purple-500">
                {projects.filter((p) => p.isFeatured).length}
              </p>
            </div>
          </div>
        </section>

        {/* Most Viewed Projects */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Most Viewed Projects</h2>
            <p className="text-neutral-500 mt-1">
              Your five most popular published projects
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {mostViewedProjects.length === 0 ? (
              <p className="p-6 text-neutral-500">
                No published projects yet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {mostViewedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-9 h-9 shrink-0 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-500">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {project.title}
                        </p>
                        <p className="text-sm text-neutral-500 truncate">
                          /{project.slug}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-blue-500">
                        {project.views.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-neutral-500">
                        views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Projects Table */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">All Projects</h2>
            <p className="text-neutral-500 mt-1">
              Manage, publish and monitor your projects
            </p>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
            <table className="w-full text-left min-w-[1100px]">
              <thead className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      No projects yet.
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

                      <td className="p-4 font-semibold text-blue-500">
                        {project.views.toLocaleString("en-US")}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handlePublishToggle(project)}
                          disabled={updatingId === project.id}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
                            project.isPublished
                              ? "bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20"
                          }`}
                        >
                          {project.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleFeaturedToggle(project)}
                          disabled={updatingId === project.id}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
                            project.isFeatured
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/30 hover:bg-purple-500/20"
                              : "bg-neutral-500/10 text-neutral-500 border border-neutral-500/30 hover:bg-neutral-500/20"
                          }`}
                        >
                          {project.isFeatured ? "★ Featured" : "☆ Not Featured"}
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
        </section>

        {/* Footer */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm text-neutral-500">
          <p>Total Projects: {projects.length}</p>
          <p>Published: {projects.filter((p) => p.isPublished).length}</p>
          <p>Drafts: {projects.filter((p) => !p.isPublished).length}</p>
          <p>Featured: {projects.filter((p) => p.isFeatured).length}</p>
        </div>

        <button
          onClick={fetchProjects}
          className="mt-6 text-sm text-blue-500 hover:text-blue-400"
        >
          Refresh Dashboard
        </button>
      </div>
    </main>
  );
}
