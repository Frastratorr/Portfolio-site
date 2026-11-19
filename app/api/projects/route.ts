import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Проверка, что modelPath пришел
    if (!body.modelPath) {
      return NextResponse.json({ error: "Model path is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        modelPath: body.modelPath,
        previewImage: body.previewImage,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}