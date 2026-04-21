import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "./normalize";

export async function matchIngredientBackend(rawName: string) {
  const normalized = normalizeIngredient(rawName);

  const item = await prisma.item.findUnique({
    where: { normalizedName: normalized },
  });

  return item ? { itemId: item.id, name: item.name } : null;
}
