// File for store-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type StoreRow = {
  id: string
  slug: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  latitude: number | null
  longitude: number | null
  createdAt: Date
  updatedAt: Date
}

// Safe select to avoid leaking relations
const storeSelect = {
  id: true,
  slug: true,
  name: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  latitude: true,
  longitude: true,
  createdAt: true,
  updatedAt: true,
} as const

export function getStoreById(id: string): Promise<StoreRow | null> {
  return prisma.store.findUnique({
    where: { id },
    select: storeSelect,
  })
}

export function getStoreBySlug(slug: string): Promise<StoreRow | null> {
  return prisma.store.findUnique({
    where: { slug },
    select: storeSelect,
  })
}

export function listStores(): Promise<StoreRow[]> {
  return prisma.store.findMany({
    orderBy: { name: "asc" },
    select: storeSelect,
  })
}

export function createStore(
  data: Omit<StoreRow, "id" | "createdAt" | "updatedAt">
): Promise<StoreRow> {
  return prisma.store.create({
    data,
    select: storeSelect,
  })
}

export function updateStore(
  id: string,
  data: Partial<Omit<StoreRow, "id" | "createdAt" | "updatedAt">>
): Promise<StoreRow> {
  return prisma.store.update({
    where: { id },
    data,
    select: storeSelect,
  })
}

export function deleteStore(id: string) {
  return prisma.store.delete({
    where: { id },
  })
}
