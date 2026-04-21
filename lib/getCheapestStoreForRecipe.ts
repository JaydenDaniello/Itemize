import { prisma } from "@/lib/prisma";

export async function getCheapestStoreForRecipe(externalId: string) {
  // 0. Resolve externalId → internal recipe.id
  const recipe = await prisma.recipe.findUnique({
    where: { externalId },
  });

  if (!recipe) return null;

  const recipeId = recipe.id;

  // 1. Load ingredients + mapped items
  const ingredients = await prisma.recipeIngredient.findMany({
    where: { recipeId },
    include: { item: true },
  });

  // 2. Load all stores + their prices
  const stores = await prisma.store.findMany({
    include: {
      storeItems: true,
    },
  });

  const results = [];

  for (const store of stores) {
    let total = 0;
    const missing: string[] = [];

    for (const ing of ingredients) {
      if (!ing.itemId) {
        missing.push(ing.rawName);
        continue;
      }

      const priceEntry = store.storeItems.find(
        (si) => si.itemId === ing.itemId
      );

      if (!priceEntry) {
        missing.push(ing.rawName);
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

  // 3. Prefer stores with complete pricing
  const completeStores = results.filter((r) => r.isComplete);

  let cheapest;

  if (completeStores.length > 0) {
    cheapest = completeStores.sort((a, b) => a.totalPrice - b.totalPrice)[0];
  } else {
    cheapest = results.sort((a, b) => a.totalPrice - b.totalPrice)[0];
  }

  return cheapest;
}
