/*
  Warnings:

  - You are about to drop the column `last_name` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "last_name",
ADD COLUMN     "lastName" TEXT;
