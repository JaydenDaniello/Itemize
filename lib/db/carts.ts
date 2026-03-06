// File for cart-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type CartRow = {
  id: string
  ownerId: string
  storeId: string | null
  status: "ACTIVE" | "CHECKED_OUT" | "ARCHIVED"
  createdAt: Date
  updatedAt: Date
}

// Safe select to avoid leaking relations
const cartSelect = {
  id: true,
  ownerId: true,
  storeId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const

export function getCartById(id: string): Promise<CartRow | null> {
  return prisma.cart.findUnique({
    where: { id },
    select: cartSelect,
  })
}

export function getCartsForUser(userId: string): Promise<CartRow[]> {
  return prisma.cart.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: cartSelect,
  })
}

export function getActiveCart(userId: string): Promise<CartRow | null> {
  return prisma.cart.findFirst({
    where: { ownerId: userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: cartSelect,
  })
}

export function createCart(
  ownerId: string,
  storeId?: string
): Promise<CartRow> {
  return prisma.cart.create({
    data: { ownerId, storeId: storeId ?? null },
    select: cartSelect,
  })
}

export function updateCart(
  id: string,
  data: Partial<Omit<CartRow, "id" | "createdAt" | "updatedAt">>
): Promise<CartRow> {
  return prisma.cart.update({
    where: { id },
    data,
    select: cartSelect,
  })
}

export function archiveCart(id: string): Promise<CartRow> {
  return prisma.cart.update({
    where: { id },
    data: { status: "ARCHIVED" },
    select: cartSelect,
  })
}

export function deleteCart(id: string) {
  return prisma.cart.delete({
    where: { id },
  })
}
