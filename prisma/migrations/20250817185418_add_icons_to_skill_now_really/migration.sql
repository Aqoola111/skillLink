/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "public"."Skill" ADD COLUMN     "icon" TEXT;
