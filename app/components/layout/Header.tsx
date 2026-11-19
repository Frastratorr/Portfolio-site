import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
          My 3D Portfolio
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
            Works
          </Link>
          <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
            About & Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}