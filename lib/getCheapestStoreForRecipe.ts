import { prisma } from "@/lib/prisma";
import { isDemoStoreName } from "@/lib/demoStores";

export async function getCheapestStoreForRecipe(externalId: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { externalId },
  });

  if (!recipe) return null;

  const ingredients = await prisma.recipeIngredient.findMany({
    where: { recipeId: recipe.id },
    include: { item: true },
  });

  const stores = await prisma.store.findMany({
    include: {
      storeItems: true,
    },
  });

  const results = [];

  for (const store of stores.filter((candidate) => isDemoStoreName(candidate.name))) {
    let total = 0;
    const missing: string[] = [];

    for (const ingredient of ingredients) {
      if (!ingredient.itemId) {
        missing.push(ingredient.rawName);
        continue;
      }

      const priceEntry = store.storeItems.find(
        (storeItem) => storeItem.itemId === ingredient.itemId
      );

      if (!priceEntry) {
        missing.push(ingredient.rawName);
        continue;
      }

      total += Number(priceEntry.price);
    }

    results.push({
      storeId: store.id,
      storeName: store.name,
      totalPrice: total,
      missingIngredients: missing,
      isComplete: missing.length === 0,
    });
  }

  const completeStores = results.filter((result) => result.isComplete);

  if (completeStores.length > 0) {
    return completeStores.sort((a, b) => a.totalPrice - b.totalPrice)[0];
  }

  return results.sort((a, b) => a.totalPrice - b.totalPrice)[0] ?? null;
}
