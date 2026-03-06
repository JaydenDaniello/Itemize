// File for item-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type ItemRow = {
  id: string
  name: string
  normalizedName: string
  category: string | null
  defaultUnit: string | null
  createdAt: Date
  updatedAt: Date
}

// Safe select to avoid leaking relations
const itemSelect = {
  id: true,
  name: true,
  normalizedName: true,
  category: true,
  defaultUnit: true,
  createdAt: true,
  updatedAt: true,
} as const

export function getItemById(id: string): Promise<ItemRow | null> {
  return prisma.item.findUnique({
    where: { id },
    select: itemSelect,
  })
}

export function findItemByNormalizedName(
  normalizedName: string
): Promise<ItemRow | null> {
  return prisma.item.findUnique({
    where: { normalizedName },
    select: itemSelect,
  })
}

export function findItemByName(name: string): Promise<ItemRow | null> {
  return prisma.item.findUnique({
    where: { normalizedName: name.toLowerCase() },
    select: itemSelect,
  })
}

export function createItem(
  data: Omit<ItemRow, "id" | "createdAt" | "updatedAt">
): Promise<ItemRow> {
  return prisma.item.create({
    data,
    select: itemSelect,
  })
}

export function updateItem(
  id: string,
  data: Partial<Omit<ItemRow, "id" | "createdAt" | "updatedAt">>
): Promise<ItemRow> {
  return prisma.item.update({
    where: { id },
    data,
    select: itemSelect,
  })
}

export async function findOrCreateItem(
  name: string,
  category?: string,
  defaultUnit?: string
): Promise<ItemRow> {
  const normalizedName = name.toLowerCase()

  const existing = await findItemByNormalizedName(normalizedName)
  if (existing) return existing

  return createItem({
    name,
    normalizedName,
    category: category ?? null,
    defaultUnit: defaultUnit ?? null,
  })
}
