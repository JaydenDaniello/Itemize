import { prisma } from "@/lib/prisma";
import { getCanonicalIngredientName } from "@/lib/normalizeIngredient";

export async function matchIngredientBackend(rawName: string) {
  const normalized = getCanonicalIngredientName(rawName);

  const item = await prisma.item.findUnique({
    where: { normalizedName: normalized },
  });

  return item ? { itemId: item.id, name: item.name } : null;
}
