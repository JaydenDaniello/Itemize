import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { signAccessToken } from "@/lib/auth/jwt";
import { ACCESS_COOKIE, accessCookieOptions } from "@/lib/auth/cookies";
import { UserAuthRow, findUserByEmail, createUser } from "@/lib/db/users"; // still need to be implemented

// Replace with real DB calls (prisma)
type UserRow = { id: string; email: string; passwordHash: string };

const registerSchema = z.object({
    email: z.email(),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"), // bcrypt input limit
});

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        const tree = z.treeifyError(parsed.error);
        return NextResponse.json(
            { error: "Invalid input", fields: tree.properties },
            { status: 400 }
        );
    }

    const { email, password } = parsed.data;

    // Normalize email to prevent duplicate accounts
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existence = await findUserByEmail(normalizedEmail);
    if (existence) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await createUser({ email: normalizedEmail, passwordHash });

    // Issue session cookie (auto login)
    const token = await signAccessToken({ sub: user.id, email: user.email });

    const res = NextResponse.json(
        { ok: true, user: { id: user.id, email: user.email } },
        { status: 201 }
    );

    res.cookies.set(ACCESS_COOKIE, token, accessCookieOptions());
    return res;
}