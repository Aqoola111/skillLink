/*
  Warnings:

  - Made the column `offeredSkillId` on table `BarterOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requestedSkillId` on table `BarterOffer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BarterOffer" DROP CONSTRAINT "BarterOffer_offeredSkillId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarterOffer" DROP CONSTRAINT "BarterOffer_requestedSkillId_fkey";

-- AlterTable
ALTER TABLE "public"."BarterOffer" ALTER COLUMN "offeredSkillId" SET NOT NULL,
ALTER COLUMN "requestedSkillId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "conversationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Skill" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillAllowedCategory" (
    "skillId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SkillAllowedCategory_pkey" PRIMARY KEY ("skillId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."SkillAllowedTag" (
    "skillId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "SkillAllowedTag_pkey" PRIMARY KEY ("skillId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "barterOfferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationParticipant" (
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("conversationId","userId")
);

-- CreateTable
CREATE TABLE "public"."_SkillTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "Tag_categoryId_idx" ON "public"."Tag"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_categoryId_key" ON "public"."Tag"("name", "categoryId");

-- CreateIndex
CREATE INDEX "SkillAllowedCategory_categoryId_idx" ON "public"."SkillAllowedCategory"("categoryId");

-- CreateIndex
CREATE INDEX "SkillAllowedTag_tagId_idx" ON "public"."SkillAllowedTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_barterOfferId_key" ON "public"."Conversation"("barterOfferId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "public"."ConversationParticipant"("userId");

-- CreateIndex
CREATE INDEX "_SkillTags_B_index" ON "public"."_SkillTags"("B");

-- CreateIndex
CREATE INDEX "BarterOffer_fromUserId_idx" ON "public"."BarterOffer"("fromUserId");

-- CreateIndex
CREATE INDEX "BarterOffer_toUserId_idx" ON "public"."BarterOffer"("toUserId");

-- CreateIndex
CREATE INDEX "BarterOffer_offeredSkillId_idx" ON "public"."BarterOffer"("offeredSkillId");

-- CreateIndex
CREATE INDEX "BarterOffer_requestedSkillId_idx" ON "public"."BarterOffer"("requestedSkillId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_skillId_idx" ON "public"."Booking"("skillId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE INDEX "Review_skillId_idx" ON "public"."Review"("skillId");

-- CreateIndex
CREATE INDEX "Skill_ownerId_idx" ON "public"."Skill"("ownerId");

-- CreateIndex
CREATE INDEX "Skill_categoryId_idx" ON "public"."Skill"("categoryId");

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Skill" ADD CONSTRAINT "Skill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillAllowedCategory" ADD CONSTRAINT "SkillAllowedCategory_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillAllowedCategory" ADD CONSTRAINT "SkillAllowedCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillAllowedTag" ADD CONSTRAINT "SkillAllowedTag_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillAllowedTag" ADD CONSTRAINT "SkillAllowedTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_barterOfferId_fkey" FOREIGN KEY ("barterOfferId") REFERENCES "public"."BarterOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarterOffer" ADD CONSTRAINT "BarterOffer_offeredSkillId_fkey" FOREIGN KEY ("offeredSkillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarterOffer" ADD CONSTRAINT "BarterOffer_requestedSkillId_fkey" FOREIGN KEY ("requestedSkillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillTags" ADD CONSTRAINT "_SkillTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillTags" ADD CONSTRAINT "_SkillTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
