-- CreateTable
CREATE TABLE "Video" (
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publishedAt" TIMESTAMP(6) NOT NULL,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("videoId")
);

-- CreateIndex
CREATE INDEX "idx_videos_published_at" ON "Video"("publishedAt");

-- CreateIndex
CREATE INDEX "idx_videos_title_description" ON "Video"("title", "description");
