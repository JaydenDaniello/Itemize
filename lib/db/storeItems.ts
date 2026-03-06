// File for storeItem-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type StoreItemRow = {
  id: string
  storeId: string
  itemId: string
  price: string
  currency: string
  lastUpdated: Date
  isEstimated: boolean
  userConfirmed: boolean
}

// Safe select to avoid leaking relations
const storeItemSelect = {
  id: true,
  storeId: true,
  itemId: true,
  price: true,
  currency: true,
  lastUpdated: true,
  isEstimated: true,
  userConfirmed: true,
} as const

export function getStoreItem(
  storeId: string,
  itemId: string
): Promise<StoreItemRow | null> {
  return prisma.storeItem.findUnique({
    where: { storeId_itemId: { storeId, itemId } },
    select: storeItemSelect,
  })
}

export function listStoreItems(storeId: string): Promise<StoreItemRow[]> {
  return prisma.storeItem.findMany({
    where: { storeId },
    select: storeItemSelect,
  })
}

export function upsertStoreItem(
  data: Omit<StoreItemRow, "id" | "lastUpdated">
): Promise<StoreItemRow> {
  return prisma.storeItem.upsert({
    where: { storeId_itemId: { storeId: data.storeId, itemId: data.itemId } },
    update: {
      ...data,
      lastUpdated: new Date(),
    },
    create: {
      ...data,
      lastUpdated: new Date(),
    },
    select: storeItemSelect,
  })
}

export function updateStoreItem(
  storeId: string,
  itemId: string,
  data: Partial<Omit<StoreItemRow, "id" | "storeId" | "itemId">>
): Promise<StoreItemRow> {
  return prisma.storeItem.update({
    where: { storeId_itemId: { storeId, itemId } },
    data: {
      ...data,
      lastUpdated: new Date(),
    },
    select: storeItemSelect,
  })
}

export function deleteStoreItem(storeId: string, itemId: string) {
  return prisma.storeItem.delete({
    where: { storeId_itemId: { storeId, itemId } },
  })
}
