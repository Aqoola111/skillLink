/*
  Warnings:

  - You are about to drop the column `description` on the `BarterOffer` table. All the data in the column will be lost.
  - You are about to drop the column `proposerId` on the `BarterOffer` table. All the data in the column will be lost.
  - You are about to drop the column `barterOfferId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `buyerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `BookingLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fromUserId` to the `BarterOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `BarterOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BarterOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."BarterStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."BarterOffer" DROP CONSTRAINT "BarterOffer_proposerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_barterOfferId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookingLog" DROP CONSTRAINT "BookingLog_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Skill" DROP CONSTRAINT "Skill_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SkillImage" DROP CONSTRAINT "SkillImage_skillId_fkey";

-- AlterTable
ALTER TABLE "public"."BarterOffer" DROP COLUMN "description",
DROP COLUMN "proposerId",
ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "requestedSkillId" TEXT,
ADD COLUMN     "status" "public"."BarterStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "toUserId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "barterOfferId",
DROP COLUMN "buyerId",
DROP COLUMN "paymentStatus",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "receiverId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Skill" DROP COLUMN "categoryId",
DROP COLUMN "priceCents",
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "paymentType" SET DEFAULT 'MONEY';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."BookingLog";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."SkillImage";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarterOffer" ADD CONSTRAINT "BarterOffer_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarterOffer" ADD CONSTRAINT "BarterOffer_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarterOffer" ADD CONSTRAINT "BarterOffer_requestedSkillId_fkey" FOREIGN KEY ("requestedSkillId") REFERENCES "public"."Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
