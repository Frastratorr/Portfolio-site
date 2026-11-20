
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_MODEL_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;
const WEBP_QUALITY = 85;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const SUPPORTED_MODEL_EXTENSIONS = [".glb", ".gltf"];

function getExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  return index >= 0 ? filename.slice(index).toLowerCase() : "";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "File is empty" },
        { status: 400 }
      );
    }

    const extension = getExtension(file.name);

    const isModel = SUPPORTED_MODEL_EXTENSIONS.includes(extension);
    const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);

    if (!isModel && !isImage) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, GLB and GLTF.",
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image size cannot exceed 20 MB." },
        { status: 413 }
      );
    }

    if (isModel && file.size > MAX_MODEL_SIZE) {
      return NextResponse.json(
        { error: "3D model size cannot exceed 100 MB." },
        { status: 413 }
      );
    }

    let uploadBody: File | Buffer = file;
    let uploadName = file.name;
    let contentType = file.type;

    const originalSize = file.size;
    let optimizedSize = originalSize;
    let savedBytes = 0;
    let savingsPercent = 0;
    let optimized = false;
    let width: number | null = null;
    let height: number | null = null;

    if (isImage) {
      const inputBuffer = Buffer.from(await file.arrayBuffer());

      const image = sharp(inputBuffer, {
        failOn: "error",
        animated: false,
        limitInputPixels: 40000000,
      });

      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        return NextResponse.json(
          { error: "Unable to read image dimensions." },
          { status: 400 }
        );
      }

      const actualType = metadata.format;

      const expectedFormats: Record<string, string> = {
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
      };

      if (actualType !== expectedFormats[file.type]) {
        return NextResponse.json(
          { error: "File content does not match its declared image type." },
          { status: 400 }
        );
      }

      if (actualType === "gif") {
        uploadBody = inputBuffer;
        contentType = "image/gif";
      } else {
        const outputBuffer = await image
          .rotate()
          .resize({
            width: MAX_IMAGE_DIMENSION,
            height: MAX_IMAGE_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({
            quality: WEBP_QUALITY,
            effort: 5,
          })
          .toBuffer();

        const outputMetadata = await sharp(outputBuffer).metadata();

        uploadBody = outputBuffer;
        uploadName = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
        contentType = "image/webp";

        optimizedSize = outputBuffer.length;
        savedBytes = Math.max(0, originalSize - optimizedSize);

        savingsPercent = Math.round(
          (savedBytes / originalSize) * 100
        );

        optimized = true;
        width = outputMetadata.width ?? null;
        height = outputMetadata.height ?? null;
      }
    }

    const blob = await put(uploadName, uploadBody, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });

    return NextResponse.json(
      {
        url: blob.url,
        pathname: blob.pathname,
        originalSize,
        optimizedSize,
        savedBytes,
        savingsPercent,
        optimized,
        contentType,
        width,
        height,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed",
      },
      { status: 500 }
    );
  }
}
