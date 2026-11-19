"use client";

import Link from "next/link";
import Image from "next/image";
import { projects } from "./lib/projects";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pt-10">
          <h1 className="text-5xl font-bold mb-4">3D Portfolio</h1>
          <p className="text-neutral-400 text-xl">Hard Surface, Environment, Props</p>
        </header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={`/projects/${project.slug}`}
                className="group block bg-neutral-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-neutral-700">
                  {project.previewImage ? (
                    <Image
                      src={project.previewImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="eager"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-neutral-500">No Preview</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-neutral-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}