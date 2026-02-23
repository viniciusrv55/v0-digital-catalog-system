import { cookies } from "next/headers"

// Mock user database — in production this comes from a real DB
const USERS = [
  {
    id: 1,
    email: "admin@zapmaxx.com.br",
    senha: "admin123",
    role: "admin" as const,
    nome: "Admin Master",
    trialEndsAt: null,
  },
  {
    id: 2,
    email: "joao@pizzadaboa.com",
    senha: "loja123",
    role: "owner" as const,
    nome: "Joao Pizza",
    trialEndsAt: "2026-12-31",
  },
]

export interface SessionPayload {
  id: number
  email: string
  role: "admin" | "owner"
  nome: string
  trialEndsAt: string | null
}

const SESSION_COOKIE = "zapmaxx_session"

/**
 * Validate credentials and return user data (null if invalid).
 */
export function validateCredentials(email: string, senha: string): SessionPayload | null {
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  )
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    nome: user.nome,
    trialEndsAt: user.trialEndsAt,
  }
}

/**
 * Set session cookie (HTTP-only, secure, SameSite=Lax).
 * The payload is base64-encoded JSON — in production, use a signed JWT.
 */
export async function setSession(payload: SessionPayload) {
  const cookieStore = await cookies()
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64")
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Clear session cookie.
 */
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Read session from cookie. Returns null if no session or invalid.
 */
export function parseSessionFromCookie(cookieValue: string | undefined): SessionPayload | null {
  if (!cookieValue) return null
  try {
    const decoded = Buffer.from(cookieValue, "base64").toString("utf-8")
    const payload = JSON.parse(decoded) as SessionPayload
    if (!payload.email || !payload.role) return null
    return payload
  } catch {
    return null
  }
}

export { SESSION_COOKIE }
