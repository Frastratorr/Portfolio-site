import { projects } from "../../lib/projects";
import ModelViewer from "../../components/ModelViewer";
import { notFound } from "next/navigation";
import Link from "next/link";

export const instant = false;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <nav className="p-6">
        <Link 
          href="/" 
          className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Gallery
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-neutral-400 text-lg">{project.description}</p>
        </header>

        <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-black">
          <ModelViewer modelPath={project.modelPath} />
        </div>
      </div>
    </main>
  );
}