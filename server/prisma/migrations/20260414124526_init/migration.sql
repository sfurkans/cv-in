-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "ownerUuid" TEXT NOT NULL,
    "templateId" TEXT NOT NULL DEFAULT 'classic',
    "theme" JSONB,
    "content" JSONB NOT NULL,
    "photoUrl" TEXT,
    "shareSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resume_shareSlug_key" ON "Resume"("shareSlug");

-- CreateIndex
CREATE INDEX "Resume_ownerUuid_idx" ON "Resume"("ownerUuid");
