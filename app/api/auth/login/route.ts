import { NextResponse } from "next/server";
import { z } from "zod"
import bcrypt from "bcryptjs";
import { ACCESS_COOKIE, accessCookieOptions, setAccessCookie } from "@/lib/auth/cookies";
import { signAccessToken } from "@/lib/auth/jwt";
import { UserAuthRow, findUserByEmail } from "@/lib/db/users"; // still need to be implemented


const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export async function POST(req: Request) {
    // Parse & validate request body
    const json = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
        const tree = z.treeifyError(parsed.error);

        return NextResponse.json(
            { 
                error: "Invalid input",
                fields: tree.properties,
            },
            { status: 400 }
        );
    }

    const { email, password } = parsed.data;

    // lookup user
    const user = await findUserByEmail(email);

    // don't reveal whether email exists
    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // verify password hash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // sign jwt + set HttpOnly cookie
    const token = await signAccessToken({ sub: user.id, email: user.email });

    const res = NextResponse.json(
        { ok: true, user: { id: user.id, email: user.email } },
        { status: 200 }
    );

    res.cookies.set(ACCESS_COOKIE, token, accessCookieOptions());

    return res;
}