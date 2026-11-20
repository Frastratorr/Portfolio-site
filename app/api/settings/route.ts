
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);

    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      siteTitle,
      siteDescription,
      siteKeywords,
      siteUrl,
      defaultOgImage,
    } = body;

    if (
      typeof siteTitle !== "string" ||
      typeof siteDescription !== "string" ||
      !Array.isArray(siteKeywords) ||
      !siteKeywords.every((item: unknown) => typeof item === "string") ||
      (siteUrl !== null && siteUrl !== undefined && typeof siteUrl !== "string") ||
      (defaultOgImage !== null &&
        defaultOgImage !== undefined &&
        typeof defaultOgImage !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        siteTitle,
        siteDescription,
        siteKeywords,
        siteUrl: siteUrl || null,
        defaultOgImage: defaultOgImage || null,
      },
      create: {
        id: 1,
        siteTitle,
        siteDescription,
        siteKeywords,
        siteUrl: siteUrl || null,
        defaultOgImage: defaultOgImage || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update site settings:", error);

    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
