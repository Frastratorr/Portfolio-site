import { prisma } from "../../lib/prisma";
import ModelViewer from "../../components/ModelViewer";
import Gallery from "../../components/ui/Gallery";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const instant = false; // Разрешаем динамический рендеринг

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Ищем проект в базе данных
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300">
      <nav className="p-6 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800"
        >
          ← Back to Gallery
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <header className="mb-12 max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">{project.title}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xl leading-relaxed">{project.description}</p>
          </div>
          {project.arLink && (
            <a 
              href={project.arLink} 
              rel="ar"
              className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              View in AR
            </a>
          )}
        </header>

        {/* 3D Вьювер */}
        <div className="rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
          <ModelViewer modelPath={project.modelPath} />
        </div>

        {/* Галерея рендеров (если есть) */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-8">Renders</h2>
            <Gallery images={project.gallery} />
          </div>
        )}

        {/* Блок процесса (если есть) */}
        {project.processImages && project.processImages.length > 0 && (
          <div className="mt-24 border-t border-neutral-200 dark:border-neutral-800 pt-12">
            <h2 className="text-3xl font-bold mb-8">Process & Wireframes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.processImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <Image 
                    src={img} 
                    alt={`Process step ${idx + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}