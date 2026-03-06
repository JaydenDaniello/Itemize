// File for cartItem-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type CartItemRow = {
  id: string
  cartId: string
  itemId: string
  quantity: number
  unit: string | null
}

// Safe select to avoid leaking relations
const cartItemSelect = {
  id: true,
  cartId: true,
  itemId: true,
  quantity: true,
  unit: true,
} as const

export function getItemsForCart(cartId: string): Promise<CartItemRow[]> {
  return prisma.cartItem.findMany({
    where: { cartId },
    select: cartItemSelect,
  })
}

export function getCartItem(
  cartId: string,
  itemId: string,
  unit: string | null
): Promise<CartItemRow | null> {
  const normalizedUnit = unit ?? ""
  return prisma.cartItem.findUnique({
    where: {
      cartId_itemId_unit: {
        cartId,
        itemId,
        unit: normalizedUnit,
      },
    },
    select: cartItemSelect,
  })
}


export function addItemToCart(
  data: Omit<CartItemRow, "id">
): Promise<CartItemRow> {
  return prisma.cartItem.create({
    data,
    select: cartItemSelect,
  })
}

export function upsertCartItem(
  cartId: string,
  itemId: string,
  unit: string | null,
  quantity: number
) {
  const normalizedUnit = unit ?? ""
  return prisma.cartItem.upsert({
    where: { cartId_itemId_unit: { cartId, itemId, unit: normalizedUnit } },
    update: { quantity },
    create: { cartId, itemId, unit: normalizedUnit, quantity },
    select: cartItemSelect,
  })
}

export function updateCartItem(
  id: string,
  data: Partial<Omit<CartItemRow, "id" | "cartId" | "itemId">>
): Promise<CartItemRow> {
  return prisma.cartItem.update({
    where: { id },
    data,
    select: cartItemSelect,
  })
}

export function removeCartItem(id: string) {
  return prisma.cartItem.delete({
    where: { id },
  })
}

export function clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({
    where: { cartId },
  })
}
