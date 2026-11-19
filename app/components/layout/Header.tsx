import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-black dark:text-white hover:text-blue-500 transition-colors">
          3D<span className="text-blue-500">.</span>PORTFOLIO
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            Works
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            About
          </Link>
          <ThemeToggle />
          <a 
            href="/cv.pdf" 
            target="_blank" 
            className="hidden sm:block text-sm font-medium bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Download CV
          </a>
        </nav>
      </div>
    </header>
  );
}