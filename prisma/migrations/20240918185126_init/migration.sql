/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Account` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "billingCycle" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionPlan" TEXT,
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
