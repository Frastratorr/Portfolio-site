import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Загружаем файл в Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // Добавляет случайный суффикс, чтобы имена не совпадали
    });

    // Возвращаем полный URL (например: https://xyz.public.blob.vercel-storage.com/file.glb)
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}