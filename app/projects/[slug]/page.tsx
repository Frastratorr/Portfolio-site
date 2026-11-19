
import { prisma } from "../../lib/prisma";
import ModelViewer from "../../components/ModelViewer";
import Gallery from "../../components/ui/Gallery";
import BeforeAfterSlider from "../../components/ui/BeforeAfterSlider";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Находим только опубликованный проект
  const project = await prisma.project.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!project) {
    notFound();
  }

  // Получаем только опубликованные проекты
  const allProjects = await prisma.project.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  });

  const currentIndex = allProjects.findIndex(
    (item) => item.id === project.id
  );

  const previousProject =
    currentIndex >= 0
      ? allProjects[currentIndex + 1] ?? null
      : null;

  const nextProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1] ?? null
      : null;

  // Technical Breakdown
  const technicalDetails = [
    {
      label: "Polygon Count",
      value:
        project.polygonCount != null
          ? project.polygonCount.toLocaleString("en-US")
          : "Not specified",
    },
    {
      label: "Triangle Count",
      value:
        project.triangleCount != null
          ? project.triangleCount.toLocaleString("en-US")
          : "Not specified",
    },
    {
      label: "Texture Resolution",
      value: project.textureResolution || "Not specified",
    },
    {
      label: "Software Used",
      value:
        project.softwareUsed?.length > 0
          ? project.softwareUsed.join(", ")
          : "Not specified",
    },
    {
      label: "Modeling Time",
      value: project.modelingTime || "Not specified",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300 hover:text-blue-500 transition-colors"
        >
          ← Back to Gallery
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* Hero Section */}
        <header className="mb-12">

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-semibold">
              {project.category || "Props"}
            </span>

            <span className="text-sm text-neutral-500">
              3D Project
            </span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                {project.title}
              </h1>

              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.arLink && (
              <a
                href={project.arLink}
                rel="ar"
                className="shrink-0 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-colors"
              >
                View in AR →
              </a>
            )}
          </div>

          {/* Project Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 3D Viewer */}
        <section className="mb-24">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">
              Interactive Preview
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              Explore in 3D
            </h2>
          </div>

          <div className="rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <ModelViewer modelPath={project.modelPath} />
          </div>
        </section>

        {/* Before / After Slider */}
        {project.processImages.length >= 2 && (
          <section className="mb-24">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">
                Visual Breakdown
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Before / After
              </h2>

              <p className="text-neutral-500 mt-3">
                Compare the wireframe with the final render.
              </p>
            </div>

            <BeforeAfterSlider
              beforeImage={project.processImages[0]}
              afterImage={project.processImages[1]}
              title={project.title}
            />
          </section>
        )}

        {/* Technical Breakdown */}
        <section className="mb-24">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">
              Production Data
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              Technical Breakdown
            </h2>

            <p className="text-neutral-500 mt-3">
              Technical specifications and production details of this model.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalDetails.map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-colors"
              >
                <p className="text-sm text-neutral-500 mb-3">
                  {item.label}
                </p>

                <p className="text-xl md:text-2xl font-bold break-words">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Renders Gallery */}
        {project.gallery.length > 0 && (
          <section className="mb-24">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">
                Visual Presentation
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Renders Gallery
              </h2>
            </div>

            <Gallery images={project.gallery} />
          </section>
        )}

        {/* Project Navigation */}
        <section className="border-t border-neutral-200 dark:border-neutral-800 pt-12">
          <div className="flex flex-col sm:flex-row justify-between gap-6">

            {previousProject ? (
              <Link
                href={`/projects/${previousProject.slug}`}
                className="flex-1 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-colors group"
              >
                <p className="text-sm text-neutral-500 mb-3">
                  ← Previous Project
                </p>

                <p className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                  {previousProject.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="flex-1 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-colors group text-right"
              >
                <p className="text-sm text-neutral-500 mb-3">
                  Next Project →
                </p>

                <p className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                  {nextProject.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

          </div>
        </section>

      </div>
    </main>
  );
}
