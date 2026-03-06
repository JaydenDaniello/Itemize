// File for storePreference-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type StorePreferenceRow = {
  id: string
  userId: string
  storeId: string
  isFavorite: boolean
  isExcluded: boolean
}

// Safe select to avoid leaking relations
const storePreferenceSelect = {
  id: true,
  userId: true,
  storeId: true,
  isFavorite: true,
  isExcluded: true,
} as const

// Get a single preference for a specific user + store
export function getStorePreference(
  userId: string,
  storeId: string
): Promise<StorePreferenceRow | null> {
  return prisma.storePreference.findUnique({
    where: { userId_storeId: { userId, storeId } },
    select: storePreferenceSelect,
  })
}

export function getAllStorePreferences(
  userId: string
): Promise<StorePreferenceRow[]> {
  return prisma.storePreference.findMany({
    where: { userId },
    select: storePreferenceSelect,
  })
}

// Upsert a preference for a specific store
export function upsertStorePreference(
  userId: string,
  storeId: string,
  data: Partial<Omit<StorePreferenceRow, "id" | "userId" | "storeId">>
): Promise<StorePreferenceRow> {
  return prisma.storePreference.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: data,
    create: { userId, storeId, ...data },
    select: storePreferenceSelect,
  })
}

export function setFavoriteStore(
  userId: string,
  storeId: string,
  isFavorite: boolean
): Promise<StorePreferenceRow> {
  return prisma.storePreference.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { isFavorite },
    create: { userId, storeId, isFavorite },
    select: storePreferenceSelect,
  })
}

export function setExcludedStore(
  userId: string,
  storeId: string,
  isExcluded: boolean
): Promise<StorePreferenceRow> {
  return prisma.storePreference.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { isExcluded },
    create: { userId, storeId, isExcluded },
    select: storePreferenceSelect,
  })
}

// Delete a preference row entirely
export function deleteStorePreference(userId: string, storeId: string) {
  return prisma.storePreference.delete({
    where: { userId_storeId: { userId, storeId } },
  })
}
