// File for recipe-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type RecipeIngredientRow = {
  id: string
  recipeId: string
  itemId: string | null
  rawName: string
  quantity: number | null
  unit: string | null
}

// Safe select to avoid leaking relations
const recipeIngredientSelect = {
  id: true,
  recipeId: true,
  itemId: true,
  rawName: true,
  quantity: true,
  unit: true,
} as const

export function getIngredientsForRecipe(
  recipeId: string
): Promise<RecipeIngredientRow[]> {
  return prisma.recipeIngredient.findMany({
    where: { recipeId },
    orderBy: { id: "asc" },
    select: recipeIngredientSelect,
  })
}

export function getIngredientById(
  id: string
): Promise<RecipeIngredientRow | null> {
  return prisma.recipeIngredient.findUnique({
    where: { id },
    select: recipeIngredientSelect,
  })
}

export function addIngredient(
  data: Omit<RecipeIngredientRow, "id">
): Promise<RecipeIngredientRow> {
  return prisma.recipeIngredient.create({
    data,
    select: recipeIngredientSelect,
  })
}

export function updateIngredient(
  id: string,
  data: Partial<Omit<RecipeIngredientRow, "id" | "recipeId">>
): Promise<RecipeIngredientRow> {
  return prisma.recipeIngredient.update({
    where: { id },
    data,
    select: recipeIngredientSelect,
  })
}

export function deleteIngredient(id: string) {
  return prisma.recipeIngredient.delete({
    where: { id },
  })
}

export function bulkInsertIngredients(
  recipeId: string,
  ingredients: Omit<RecipeIngredientRow, "id" | "recipeId">[]
) {
  return prisma.recipeIngredient.createMany({
    data: ingredients.map(i => ({
      recipeId,
      ...i,
    })),
  })
}
