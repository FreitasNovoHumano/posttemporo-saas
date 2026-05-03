/*
  Warnings:

  - You are about to drop the `ContentLibrary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentLibrary" DROP CONSTRAINT "ContentLibrary_companyId_fkey";

-- DropTable
DROP TABLE "ContentLibrary";

-- DropEnum
DROP TYPE "ContentType";
