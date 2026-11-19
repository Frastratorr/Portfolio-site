-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Props',
ADD COLUMN     "finalRender" TEXT,
ADD COLUMN     "modelingTime" TEXT,
ADD COLUMN     "polygonCount" INTEGER,
ADD COLUMN     "softwareUsed" TEXT[],
ADD COLUMN     "textureResolution" TEXT,
ADD COLUMN     "triangleCount" INTEGER,
ADD COLUMN     "wireframeImage" TEXT;
