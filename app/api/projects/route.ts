
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// GET — получить все проекты
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST — создать проект
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.modelPath || !body.title || !body.slug || !body.description) {
      return NextResponse.json(
        { error: "Missing required project fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        modelPath: body.modelPath,
        previewImage: body.previewImage || null,
        gallery: body.gallery || [],
        processImages: body.processImages || [],
        arLink: body.arLink || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
