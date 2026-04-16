/** COMMENTED FOR FASTER DEV TESTING
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";

const protectedPaths = ["/home", "/recipes", "/cart", "/stores"];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    const url = new URL("/", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    await verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set(ACCESS_COOKIE, "", {
      path: "/",
      expires: new Date(0),
    });
    return res;
  }
}

export const config = {
  matcher: ["/home/:path*", "/recipes/:path*", "/cart/:path*", "/stores/:path*"],
};
*/