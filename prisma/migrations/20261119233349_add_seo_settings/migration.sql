-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seoTitle" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteTitle" TEXT NOT NULL DEFAULT '3D Artist Portfolio',
    "siteDescription" TEXT NOT NULL DEFAULT '3D Artist Portfolio',
    "siteKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "siteUrl" TEXT,
    "defaultOgImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
