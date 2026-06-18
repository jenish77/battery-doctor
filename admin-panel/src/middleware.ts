/**
 * Next.js Middleware - Route Protection
 *
 * Protects all dashboard routes by checking for auth token in cookies.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users away from /login to dashboard.
 *
 * IMPORTANT: /api routes are EXCLUDED so the Next.js rewrite proxy works.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_KEY = "bd_access_token";

// Routes that don't require authentication
const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  // Skip middleware for API proxy routes (handled by Next.js rewrites)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if user is trying to access a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If trying to access protected route without token → redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to access login → redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API proxy routes - handled by Next.js rewrites)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
