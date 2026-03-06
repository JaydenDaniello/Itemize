/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Made the column `externalId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "externalId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_normalizedName_key" ON "Item"("normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_externalId_key" ON "Recipe"("externalId");
