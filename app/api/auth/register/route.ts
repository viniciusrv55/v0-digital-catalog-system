import { NextResponse } from "next/server"
import { registerUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { nome, email, senha, role, estabelecimentoNome } = await request.json()

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Nome, email e senha sao obrigatorios" },
        { status: 400 }
      )
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    const result = registerUser({
      nome,
      email,
      senha,
      role: role || "estabelecimento",
      estabelecimentoNome,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      )
    }

    const token = createSessionToken(result.user)

    const response = NextResponse.json({
      user: result.user,
      message: "Conta criada com sucesso",
    })

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
