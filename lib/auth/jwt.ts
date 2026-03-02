import "server-only";
import { error } from "console";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env"

const encoder = new TextEncoder();
const secret = encoder.encode(env.JWT_SECRET);

export type SessionPayload = {
    sub: string; // subject (UserID)
    email: string;
}

export async function signAccessToken(payload: SessionPayload) {
    return await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify(token, secret, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
    });

    return {
        userId: payload.sub as string,
        email: payload.email as string,
    };
}