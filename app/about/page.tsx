import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">About Me</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Ваше фото */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-800">
          {/* Положите ваше фото в public/images/avatar.jpg */}
          <Image 
            src="/images/avatar.jpg" 
            alt="Profile" 
            fill 
            className="object-cover"
          />
        </div>
        
        {/* Текст о себе */}
        <div className="md:col-span-2 space-y-4 text-neutral-300">
          <p>
            Hi! I'm a 3D Artist specializing in hard-surface modeling, props, and environment design. 
            I love creating detailed and optimized assets for games and real-time applications.
          </p>
          <p>
            My main tools are Blender, Substance Painter, and Marmoset Toolbag. 
            I'm always open to new opportunities and freelance projects.
          </p>
        </div>
      </div>

      {/* Блок контактов */}
      <div className="bg-neutral-800 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <div className="flex flex-col gap-4">
          <a href="mailto:your@email.com" className="text-blue-400 hover:text-blue-300 transition-colors text-lg">
            your@email.com
          </a>
          <div className="flex gap-6">
            <a href="https://artstation.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
              ArtStation Profile
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}