import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "zapmaxx_session"

function parseToken(token: string): {
  id: number
  email: string
  role: string
  estabelecimentoId?: number
} | null {
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

  // Static / api / public assets — always pass through
  const isStatic =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  const isApi = pathname.startsWith("/api/")

  if (isStatic) {
    return NextResponse.next()
  }

  // For API routes, forward tenant header when user is authenticated
  if (isApi) {
    if (user?.estabelecimentoId) {
      const headers = new Headers(request.headers)
      headers.set("x-tenant-id", String(user.estabelecimentoId))
      return NextResponse.next({ request: { headers } })
    }
    return NextResponse.next()
  }

  // Public routes
  const publicPaths = ["/", "/login", "/cadastro", "/esqueci-senha", "/pagamento"]
  const isPublic = publicPaths.some((p) => pathname === p)

  if (isPublic) {
    // Redirect logged-in users away from auth pages
    if (user && (pathname === "/login" || pathname === "/cadastro")) {
      const redirectTo = user.role === "admin" ? "/admin" : "/painel"
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
    return NextResponse.next()
  }

  // Protected: /admin routes — require admin role
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/painel", request.url))
    }
    // Forward tenant header
    const headers = new Headers(request.headers)
    headers.set("x-user-role", user.role)
    return NextResponse.next({ request: { headers } })
  }

  // Protected: /painel routes — require estabelecimento or admin role
  if (pathname.startsWith("/painel")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== "estabelecimento" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    // Forward tenant id as header for downstream use
    const headers = new Headers(request.headers)
    if (user.estabelecimentoId) {
      headers.set("x-tenant-id", String(user.estabelecimentoId))
    }
    headers.set("x-user-role", user.role)
    return NextResponse.next({ request: { headers } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-light-32x32.png|icon-dark-32x32.png|icon.svg|apple-icon.png).*)",
  ],
}
