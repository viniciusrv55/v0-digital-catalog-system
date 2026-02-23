import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "zapmaxx_session"

function parseToken(token: string): { id: number; email: string; role: string } | null {
  try {
    const parsed = JSON.parse(atob(token))
    if (parsed && parsed.id && parsed.email && parsed.role) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const user = token ? parseToken(token) : null

  // Public routes - no protection needed
  const publicPaths = ["/", "/login", "/cadastro", "/esqueci-senha", "/pagamento"]
  const isPublic = publicPaths.some((p) => pathname === p)
  const isApi = pathname.startsWith("/api/")
  const isStatic = pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.includes(".")

  if (isPublic || isApi || isStatic) {
    // If user is logged in and trying to access login/signup, redirect to their dashboard
    if (user && (pathname === "/login" || pathname === "/cadastro")) {
      const redirectTo = user.role === "admin" ? "/admin" : "/painel"
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
    return NextResponse.next()
  }

  // Protected: /admin routes - require admin role
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== "admin") {
      // Establishment user trying to access admin -> redirect to painel
      return NextResponse.redirect(new URL("/painel", request.url))
    }
    return NextResponse.next()
  }

  // Protected: /painel routes - require estabelecimento or admin role
  if (pathname.startsWith("/painel")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== "estabelecimento" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-light-32x32.png|icon-dark-32x32.png|icon.svg|apple-icon.png).*)",
  ],
}
