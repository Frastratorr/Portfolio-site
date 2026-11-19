import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url', { status: 400 });
  }

  try {
    // Получаем файл из приватного хранилища
    const blob = await get(url);
    if (!blob || !blob.stream) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Отдаем файл в браузер
    return new NextResponse(blob.stream, {
      headers: {
        'Content-Type': blob.blob.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse('Error', { status: 500 });
  }
}