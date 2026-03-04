// File for user-related db requests (remains to be implemented)
import "server-only"
import { prisma } from "@/lib/prisma"

export type UserAuthRow = {
    id: string;
    email: string;
    passwordHash: string;
};

export async function findUserByEmail(email: string): Promise<UserAuthRow | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });
  return user;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
}): Promise<UserAuthRow> {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
    },
    select: { id: true, email: true, passwordHash: true },
  });
}

export async function findUserById(id: string): Promise<UserAuthRow | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    },
  });
}
