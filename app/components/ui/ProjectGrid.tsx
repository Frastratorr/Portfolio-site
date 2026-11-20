
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

type ProjectGridProps = {
  projects: Project[];
  variant?: "featured" | "all";
};

export default function ProjectGrid({
  projects,
  variant = "all",
}: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isFeatured = variant === "featured";

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
      {/* Search and filters are only available in the all projects section */}
      {!isFeatured && (
        <div className="mb-10">
          <div className="mb-6">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects, descriptions or tags..."
              className="w-full md:max-w-md px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none focus:border-blue-500 transition-colors text-sm"
            />

            <p className="text-sm text-neutral-500 mt-3">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
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
        </div>
      )}

      {/* Project cards */}
      {filteredProjects.length > 0 ? (
        <div
          className={
            isFeatured
              ? "grid grid-cols-1 md:grid-cols-2 gap-8"
              : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          }
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="h-full"
            >
              <Link
                href={`/projects/${project.slug}`}
                className={`group flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
                  isFeatured
                    ? "rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/60"
                    : "rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/60"
                }`}
              >
                {/* Featured project preview */}
                <div
                  className={`relative overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800 ${
                    isFeatured ? "aspect-[16/10]" : "aspect-[4/3]"
                  }`}
                >
                  {project.previewImage ? (
                    <Image
                      src={project.previewImage}
                      alt={project.title}
                      fill
                      sizes={
                        isFeatured
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      }
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-neutral-500">No Preview</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />

                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {project.category || "Props"}
                    </span>
                  </div>

                  {isFeatured && (
                    <div className="absolute top-5 right-5">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
                        ★ Featured
                      </span>
                    </div>
                  )}

                  {isFeatured && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-white/75 line-clamp-2 max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-5 right-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold">
                      View Project →
                    </span>
                  </div>
                </div>

                {/* Standard project information */}
                {!isFeatured && (
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed flex-grow line-clamp-3">
                      {project.description}
                    </p>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">
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
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <p className="text-xl font-semibold mb-2">
            No projects found
          </p>

          <p className="text-neutral-500 text-sm mb-6">
            {isFeatured
              ? "Featured projects will appear here."
              : "Try changing your search or category."}
          </p>

          {!isFeatured && (
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
          )}
        </div>
      )}
    </section>
  );
}
