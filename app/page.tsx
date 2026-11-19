import { prisma } from "./lib/prisma";
import ProjectGrid from "./components/ui/ProjectGrid";
import { connection } from "next/server"; // 👈 Импортируем connection

export const instant = false; // 👈 Оставляем, чтобы разрешить блокировку

export default async function Home() {
  await connection(); // 👈 Говорим Next.js: "Этот код должен выполняться при каждом запросе"

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <header className="mb-20">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
            Junior 3D Artist
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            BUILDING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              WORLDS.
            </span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xl max-w-2xl">
            I am an aspiring 3D Artist. I create game-ready 3D models, 
            focusing on hard surface, props, and environment design. 
            Passionate about learning and delivering high-quality assets.
          </p>
        </header>

        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-neutral-500 mb-4">No projects in the database yet.</p>
            <p className="text-sm text-neutral-400">Add your first project using the Admin panel!</p>
          </div>
        )}
      </div>
    </main>
  );
}