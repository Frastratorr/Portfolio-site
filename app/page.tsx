
import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "./lib/prisma";
import ProjectGrid from "./components/ui/ProjectGrid";
import { connection } from "next/server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  const siteTitle = settings?.siteTitle || "3D Artist Portfolio";
  const siteDescription =
    settings?.siteDescription || "3D Artist Portfolio";

  let metadataBase: URL | undefined;

  if (settings?.siteUrl) {
    try {
      metadataBase = new URL(settings.siteUrl);
    } catch {
      console.error("Invalid site URL in SEO settings");
    }
  }

  const ogImage = settings?.defaultOgImage || undefined;

  return {
    metadataBase,
    title: siteTitle,
    description: siteDescription,
    keywords: settings?.siteKeywords ?? [],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description: siteDescription,
      url: "/",
      siteName: siteTitle,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: siteTitle,
      description: siteDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

async function ProjectsSection() {
  await connection();

  const [featuredProjects, allProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.project.findMany({
      where: {
        isPublished: true,
        isFeatured: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="space-y-24">
      {featuredProjects.length > 0 && (
        <section>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-3">
              Selected Work
            </p>

            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Featured Projects
            </h2>

            <p className="text-neutral-500 dark:text-neutral-400 mt-3">
              A selection of my best 3D projects.
            </p>
          </div>

          <ProjectGrid
            projects={featuredProjects}
            variant="featured"
          />
        </section>
      )}

      <section>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-3">
            Portfolio
          </p>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            All Projects
          </h2>

          <p className="text-neutral-500 dark:text-neutral-400 mt-3">
            Explore my 3D models, props and environments.
          </p>
        </div>

        {allProjects.length > 0 ? (
          <ProjectGrid
            projects={allProjects}
            variant="all"
          />
        ) : (
          <div className="py-16 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
            <p className="text-neutral-500">
              {featuredProjects.length > 0
                ? "No additional projects available."
                : "No projects available yet."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
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

        <Suspense
          fallback={
            <div className="text-center py-20 text-neutral-500">
              Loading projects...
            </div>
          }
        >
          <ProjectsSection />
        </Suspense>
      </div>
    </main>
  );
}
