"use client";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-neutral-500 text-sm">
          © 2026 My 3D Portfolio. All rights reserved.
        </p>
        <div className="flex gap-4 text-neutral-400 text-sm">
          <a href="https://artstation.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ArtStation</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="mailto:your@email.com" className="hover:text-white transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}