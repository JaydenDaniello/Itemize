/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,rawName]` on the table `RecipeIngredient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_rawName_key" ON "RecipeIngredient"("recipeId", "rawName");
