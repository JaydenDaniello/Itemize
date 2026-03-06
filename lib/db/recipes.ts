// File for recipe-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type RecipeRow = {
  id: string
  externalId: string
  title: string
  source: string | null
  thumbnailUrl: string | null
  instructions: string | null
  createdAt: Date
  updatedAt: Date
}

// Safe select to avoid leaking relations
const recipeSelect = {
  id: true,
  externalId: true,
  title: true,
  source: true,
  thumbnailUrl: true,
  instructions: true,
  createdAt: true,
  updatedAt: true,
} as const

export function getRecipeById(id: string): Promise<RecipeRow | null> {
  return prisma.recipe.findUnique({
    where: { id },
    select: recipeSelect,
  })
}

export function getRecipeByExternalId(
  externalId: string
): Promise<RecipeRow | null> {
  return prisma.recipe.findUnique({
    where: { externalId },
    select: recipeSelect,
  })
}

export function listRecipes(): Promise<RecipeRow[]> {
  return prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    select: recipeSelect,
  })
}

export function createRecipe(
  data: Omit<RecipeRow, "id" | "createdAt" | "updatedAt">
): Promise<RecipeRow> {
  return prisma.recipe.create({
    data,
    select: recipeSelect,
  })
}

export function updateRecipe(
  id: string,
  data: Partial<Omit<RecipeRow, "id" | "createdAt" | "updatedAt">>
): Promise<RecipeRow> {
  return prisma.recipe.update({
    where: { id },
    data,
    select: recipeSelect,
  })
}

export function upsertRecipe(
  externalId: string,
  data: Omit<RecipeRow, "id" | "externalId" | "createdAt" | "updatedAt">
): Promise<RecipeRow> {
  return prisma.recipe.upsert({
    where: { externalId },
    update: data,
    create: { externalId, ...data },
    select: recipeSelect,
  })
}
