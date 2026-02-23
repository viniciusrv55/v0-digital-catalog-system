import type { UserRole, AuthUser } from "./auth-store"

// Mock users database - in production, replace with Prisma/DB queries
const MOCK_USERS = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@zapmaxx.com",
    senha: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: 2,
    nome: "Pizza da Boa",
    email: "pizzadaboa@email.com",
    senha: "pizza123",
    role: "estabelecimento" as UserRole,
    estabelecimentoId: 1,
  },
  {
    id: 3,
    nome: "Acai Power",
    email: "acai@power.com",
    senha: "acai123",
    role: "estabelecimento" as UserRole,
    estabelecimentoId: 2,
  },
]

// Registered users store (in-memory for this session)
let registeredUsers = [...MOCK_USERS]

export function authenticateUser(
  email: string,
  senha: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const user = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  )

  if (!user) {
    return { success: false, error: "Email ou senha incorretos" }
  }

  return {
    success: true,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      estabelecimentoId: user.estabelecimentoId,
    },
  }
}

export function registerUser(data: {
  nome: string
  email: string
  senha: string
  role: UserRole
  estabelecimentoNome?: string
}): { success: true; user: AuthUser } | { success: false; error: string } {
  const exists = registeredUsers.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  )

  if (exists) {
    return { success: false, error: "Este email ja esta cadastrado" }
  }

  const newUser = {
    id: registeredUsers.length + 1,
    nome: data.nome,
    email: data.email,
    senha: data.senha,
    role: data.role,
    estabelecimentoId:
      data.role === "estabelecimento" ? registeredUsers.length + 100 : undefined,
  }

  registeredUsers = [...registeredUsers, newUser]

  return {
    success: true,
    user: {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      estabelecimentoId: newUser.estabelecimentoId,
    },
  }
}

export function findUserByEmail(email: string) {
  return registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
}

// Session token helpers (simple base64 encoding for mock - use JWT in production)
export function createSessionToken(user: AuthUser): string {
  return btoa(JSON.stringify(user))
}

export function parseSessionToken(token: string): AuthUser | null {
  try {
    const parsed = JSON.parse(atob(token))
    if (parsed && parsed.id && parsed.email && parsed.role) {
      return parsed as AuthUser
    }
    return null
  } catch {
    return null
  }
}

export const SESSION_COOKIE_NAME = "zapmaxx_session"
