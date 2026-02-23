import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, parseSessionFromCookie } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const session = parseSessionFromCookie(sessionCookie)

  // ─── Protect /admin routes ───
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/painel", request.url))
    }
    return NextResponse.next()
  }

  // ─── Protect /painel routes ───
  if (pathname.startsWith("/painel")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (session.role !== "owner" && session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Trial expiration check — allow /painel/plano so user can upgrade
    if (session.trialEndsAt && !pathname.startsWith("/painel/plano")) {
      const expirationDate = new Date(session.trialEndsAt)
      const now = new Date()
      if (now > expirationDate) {
        return NextResponse.redirect(new URL("/painel/plano", request.url))
      }
    }

    return NextResponse.next()
  }

  // ─── Redirect logged-in users away from /login ───
  if (pathname === "/login" && session) {
    const dest = session.role === "admin" ? "/admin" : "/painel"
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/painel/:path*", "/login"],
}
