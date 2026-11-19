"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "../../../prisma/app/lib/prisma/client";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full"
        >
          <Link 
            href={`/projects/${project.slug}`}
            className="group flex flex-col h-full relative rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300"
          >
            <div className="aspect-[4/3] relative overflow-hidden shrink-0">
              {project.previewImage ? (
                <Image
                  src={project.previewImage} // 👈 Обычная ссылка из Vercel Blob
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-neutral-200 dark:bg-neutral-800">
                  <span className="text-neutral-500">No Preview</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-3xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                {project.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg flex-grow">
                {project.description}
              </p>
              
              <div className="flex gap-2 mt-auto pt-6">
                <span className="px-3 py-1 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">Blender</span>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">Substance</span>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300">Game Ready</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}