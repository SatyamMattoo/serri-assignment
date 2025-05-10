/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `videoId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `video_id` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "videoId",
ADD COLUMN     "video_id" TEXT NOT NULL,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("video_id");
