
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

const categories = [
  "Hard Surface",
  "Props",
  "Environment",
  "Sci-Fi",
  "Weapons",
  "Architecture",
];

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Map(
      value
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => [tag.toLowerCase(), tag] as const)
    ).values(),
  ];
}

function parseOptionalNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error(
      "Polygon and triangle counts must be non-negative integers."
    );
  }

  return number;
}

function parseOptionalString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("SEO fields must contain text values.");
  }

  return value.trim() || null;
}

// Get all projects for the admin dashboard
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        tags: true,
        createdAt: true,
        isPublished: true,
        isFeatured: true,
        views: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// Create a project
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.slug ||
      !body.title ||
      !body.description ||
      !body.modelPath
    ) {
      return NextResponse.json(
        { error: "Missing required project fields" },
        { status: 400 }
      );
    }

    const category = categories.includes(body.category)
      ? body.category
      : "Props";

    const polygonCount = parseOptionalNumber(body.polygonCount);
    const triangleCount = parseOptionalNumber(body.triangleCount);

    const project = await prisma.project.create({
      data: {
        slug: String(body.slug).trim(),
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        modelPath: String(body.modelPath),

        previewImage: body.previewImage || null,
        gallery: Array.isArray(body.gallery) ? body.gallery : [],
        processImages: Array.isArray(body.processImages)
          ? body.processImages
          : [],

        category,
        tags: normalizeTags(body.tags),

        isPublished:
          typeof body.isPublished === "boolean"
            ? body.isPublished
            : true,

        isFeatured:
          typeof body.isFeatured === "boolean"
            ? body.isFeatured
            : false,

        wireframeImage: body.wireframeImage || null,
        finalRender: body.finalRender || null,

        polygonCount,
        triangleCount,

        textureResolution: body.textureResolution || null,

        softwareUsed: Array.isArray(body.softwareUsed)
          ? body.softwareUsed
          : [],

        modelingTime: body.modelingTime || null,

        // SEO Settings
        seoTitle: parseOptionalString(body.seoTitle),
        seoDescription: parseOptionalString(body.seoDescription),
        seoKeywords: normalizeTags(body.seoKeywords),
        ogTitle: parseOptionalString(body.ogTitle),
        ogDescription: parseOptionalString(body.ogDescription),
        ogImage: parseOptionalString(body.ogImage),
        canonicalUrl: parseOptionalString(body.canonicalUrl),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);

    if (
      error instanceof Error &&
      (
        error.message.includes("counts must") ||
        error.message.includes("SEO fields")
      )
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This project slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
