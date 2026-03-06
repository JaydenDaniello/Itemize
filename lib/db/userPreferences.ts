// File for userPreference-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type UserPreferenceRow = {
  id: string
  userId: string
  optimizeFor: string
  monthlyBudget: string | null
  perTripBudget: string | null
}

// Safe select to avoid leaking relations
const preferenceSelect = {
  id: true,
  userId: true,
  optimizeFor: true,
  monthlyBudget: true,
  perTripBudget: true,
} as const

export function getUserPreference(
  userId: string
): Promise<UserPreferenceRow | null> {
  return prisma.userPreference.findUnique({
    where: { userId },
    select: preferenceSelect,
  })
}

export function upsertUserPreference(
  userId: string,
  data: Partial<Omit<UserPreferenceRow, "id" | "userId">>
): Promise<UserPreferenceRow> {
  return prisma.userPreference.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    select: preferenceSelect,
  })
}

export function ensureUserPreference(
  userId: string
): Promise<UserPreferenceRow> {
  return prisma.userPreference.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: preferenceSelect,
  })
}

// Delete a preference row entirely
export function deleteUserPreference(userId: string) {
  return prisma.userPreference.delete({ where: { userId } });
}
