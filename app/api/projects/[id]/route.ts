import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const categories = [
  "Hard Surface",
  "Props",
  "Environment",
  "Sci-Fi",
  "Weapons",
  "Architecture",
];

function parseOptionalNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error("Polygon and triangle counts must be non-negative integers.");
  }

  return number;
}

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Get project error:", error);

    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.slug || !body.title || !body.description) {
      return NextResponse.json(
        { error: "Title, slug and description are required" },
        { status: 400 }
      );
    }

    const data = {
      slug: String(body.slug).trim(),
      title: String(body.title).trim(),
      description: String(body.description).trim(),

      ...(typeof body.modelPath === "string" && body.modelPath
        ? { modelPath: body.modelPath }
        : {}),

      ...(body.previewImage !== undefined
        ? { previewImage: body.previewImage || null }
        : {}),

      ...(Array.isArray(body.gallery)
        ? { gallery: body.gallery }
        : {}),

      ...(Array.isArray(body.processImages)
        ? { processImages: body.processImages }
        : {}),

      ...(body.category !== undefined
        ? {
            category: categories.includes(body.category)
              ? body.category
              : "Props",
          }
        : {}),

      ...(body.wireframeImage !== undefined
        ? { wireframeImage: body.wireframeImage || null }
        : {}),

      ...(body.finalRender !== undefined
        ? { finalRender: body.finalRender || null }
        : {}),

      ...(body.polygonCount !== undefined
        ? { polygonCount: parseOptionalNumber(body.polygonCount) }
        : {}),

      ...(body.triangleCount !== undefined
        ? { triangleCount: parseOptionalNumber(body.triangleCount) }
        : {}),

      ...(body.textureResolution !== undefined
        ? { textureResolution: body.textureResolution || null }
        : {}),

      ...(Array.isArray(body.softwareUsed)
        ? { softwareUsed: body.softwareUsed }
        : {}),

      ...(body.modelingTime !== undefined
        ? { modelingTime: body.modelingTime || null }
        : {}),
    };

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);

    if (error instanceof Error && error.message.includes("counts must")) {
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
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}