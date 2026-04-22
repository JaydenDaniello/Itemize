import { lookupMeal } from "@/lib/themealdb";
import { prisma } from "@/lib/prisma";
import { normalizeName, parseMeasure } from "./parse";

export async function ingestMeal(mealId: string) {
  const meal = await lookupMeal(mealId);
  if (!meal) return null;

  // 1. Insert recipe if it doesn't exist
  const recipe = await prisma.recipe.upsert({
    where: { id: meal.idMeal },
    update: {},
    create: {
      id: meal.idMeal,
      title: meal.strMeal,
      instructions: meal.strInstructions,
      thumbnailUrl: meal.strMealThumb,
      externalId: meal.idMeal,
    },
  });

  // 2. Process ingredients
  for (const ing of meal.ingredients) {
    const normalizedName = normalizeName(ing.name);
    const { quantity, unit } = parseMeasure(ing.measure);

    // 2a. Ensure Item exists
    const item = await prisma.item.upsert({
      where: { normalizedName },
      update: {},
      create: {
        id: normalizedName,
        normalizedName,
        name: ing.name,
        defaultUnit: unit,
        category: "misc",
      },
    });

    // 2b. Insert RecipeIngredient
    const existingIngredient = await prisma.recipeIngredient.findFirst({
      where: {
        recipeId: recipe.id,
        rawName: ing.name,
      },
      select: { id: true },
    });

    if (existingIngredient) {
      await prisma.recipeIngredient.update({
        where: { id: existingIngredient.id },
        data: {
          quantity,
          unit,
          itemId: item.id,
        },
      });
    } else {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          rawName: ing.name,
          quantity,
          unit,
          itemId: item.id,
        },
      });
    }
  }

  return recipe;
}
