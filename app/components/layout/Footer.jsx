export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-black dark:text-white font-bold text-xl mb-1">Let's connect</p>
          <a href="mailto:your@email.com" className="text-blue-500 hover:text-blue-400 transition-colors">
            your@email.com
          </a>
        </div>
        <div className="flex gap-6 text-neutral-500 dark:text-neutral-400 text-sm font-medium">
          <a href="https://artstation.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">ArtStation</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}