import "server-only"
import { serialize } from "cookie"
import { env } from "@/lib/env"

export const ACCESS_COOKIE = "access_token";

export function accessCookieOptions() {
    const isProd = env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProd, // HTTPS in production
        sameSite: "lax" as const, // needs to be 'none' if we do cross-site auth
        path: "/",
        maxAge: 60 * 15, // 15 mins
    };
}

// Helper function, not currently used
export function setAccessCookie(token: string) {
    return serialize(ACCESS_COOKIE, token, accessCookieOptions());
}

// Helper function, not currently used
export function clearAccessCookie() {
    // Sets maxAge: 0
    return serialize(ACCESS_COOKIE, "", { ...accessCookieOptions(), maxAge: 0 });
}