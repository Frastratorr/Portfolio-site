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

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        createdAt: true,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.slug || !body.title || !body.description || !body.modelPath) {
      return NextResponse.json(
        { error: "Missing required project fields" },
        { status: 400 }
      );
    }

    const category = categories.includes(body.category)
      ? body.category
      : "Props";

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

        wireframeImage: body.wireframeImage || null,
        finalRender: body.finalRender || null,

        polygonCount:
          body.polygonCount !== "" &&
          body.polygonCount !== null &&
          body.polygonCount !== undefined
            ? Number(body.polygonCount)
            : null,

        triangleCount:
          body.triangleCount !== "" &&
          body.triangleCount !== null &&
          body.triangleCount !== undefined
            ? Number(body.triangleCount)
            : null,

        textureResolution: body.textureResolution || null,

        softwareUsed: Array.isArray(body.softwareUsed)
          ? body.softwareUsed
          : [],

        modelingTime: body.modelingTime || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);

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