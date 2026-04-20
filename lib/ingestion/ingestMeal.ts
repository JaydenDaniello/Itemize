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
      thumbnail: meal.strMealThumb,
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
    await prisma.recipeIngredient.upsert({
      where: {
        recipeId_rawName: {
          recipeId: recipe.id,
          rawName: ing.name,
        },
      },
      update: {},
      create: {
        recipeId: recipe.id,
        rawName: ing.name,
        quantity,
        unit,
        itemId: item.id,
      },
    });
  }

  return recipe;
}
