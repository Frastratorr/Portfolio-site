import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Заголовок и фото */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-neutral-200 dark:border-neutral-800 shrink-0 shadow-xl">
            <Image 
              src="/images/avatar.jpg" 
              alt="My Photo" 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Hi, I'm an aspiring 3D Artist.</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              I am currently learning and growing in the field of 3D modeling. 
              My main focus is on hard-surface modeling and props. I love the process 
              of turning simple shapes into detailed, game-ready assets.
            </p>
          </div>
        </div>

        {/* Таймлайн */}
        <div>
          <h2 className="text-3xl font-bold mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-4">My Journey</h2>
          
          <div className="space-y-10 border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 md:ml-6">
            
            {/* Шаг 1 */}
            <div className="relative pl-8 md:pl-12">
              {/* Точка */}
              <div className="absolute left-[-7px] top-2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 mb-2">
                <span className="text-sm font-bold text-blue-500 tracking-wider uppercase shrink-0">2024 - Present</span>
                <h3 className="text-xl font-bold">Learning & Building Portfolio</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Creating personal projects to master Blender and Substance Painter. Building this portfolio from scratch.
              </p>
            </div>

            {/* Шаг 2 */}
            <div className="relative pl-8 md:pl-12">
              {/* Точка */}
              <div className="absolute left-[-7px] top-2 w-3 h-3 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 mb-2">
                <span className="text-sm font-bold text-neutral-500 tracking-wider uppercase shrink-0">2023</span>
                <h3 className="text-xl font-bold">First Steps in 3D</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Discovered the world of 3D graphics. Started learning basic modeling, texturing, and rendering.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}