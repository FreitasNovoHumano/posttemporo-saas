/*
  Warnings:

  - The values [PENDING] on the enum `PostStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionComment` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Post` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostStatus_new" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."Post" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "status" TYPE "PostStatus_new" USING ("status"::text::"PostStatus_new");
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
ALTER TYPE "PostStatus_new" RENAME TO "PostStatus";
DROP TYPE "public"."PostStatus_old";
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image",
DROP COLUMN "rejectionComment",
DROP COLUMN "scheduledAt",
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
