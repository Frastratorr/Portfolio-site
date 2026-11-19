
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Project } from "../../lib/prisma/client";

const categories = [
  "All",
  "Hard Surface",
  "Props",
  "Environment",
  "Sci-Fi",
  "Weapons",
  "Architecture",
];

export default function ProjectGrid({
  projects,
}: {
  projects: Project[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" ||
        project.category === activeCategory;

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tags ?? []).some((tag) =>
          tag.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">
            Selected Works
          </p>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            My Projects
          </h2>

          <p className="text-neutral-500 mt-2">
            Explore my 3D models and creative experiments.
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search projects, descriptions or tags..."
          className="w-full md:max-w-md px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none focus:border-blue-500 transition-colors text-sm"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {categories.map((category) => {
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                active
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col h-full relative rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/60 transition-all duration-300"
              >
                {/* Preview */}
                <div className="aspect-[4/3] relative overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                  {project.previewImage ? (
                    <Image
                      src={project.previewImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-neutral-500">
                        No Preview
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                  {/* Category */}
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {project.category || "Props"}
                    </span>
                  </div>

                  {/* View project */}
                  <div className="absolute bottom-5 right-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold">
                      View Project →
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {project.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Software */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.softwareUsed?.length > 0 ? (
                      project.softwareUsed.slice(0, 4).map((software) => (
                        <span
                          key={software}
                          className="px-3 py-1.5 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300"
                        >
                          {software}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1.5 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-500">
                        3D Artwork
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <p className="text-xl font-semibold mb-2">
            No projects found
          </p>

          <p className="text-neutral-500 text-sm mb-6">
            Try changing your search or category.
          </p>

          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
