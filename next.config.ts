import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Нужно для корректной работы Three.js в Next.js 16
  transpilePackages: ['three'],
  
  // Разрешаем Next.js загружать картинки из облака Vercel Blob
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;