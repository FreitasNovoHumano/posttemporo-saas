-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_userId_fkey";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- DropIndex
DROP INDEX "Invite_companyId_idx";

-- DropIndex
DROP INDEX "Membership_companyId_idx";

-- DropIndex
DROP INDEX "Membership_userId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "Post_companyId_idx";

-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- DropIndex
DROP INDEX "UserPermission_userId_companyId_idx";

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "document" TEXT;

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_whatsapp_idx" ON "Lead"("whatsapp");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
