import { NextResponse } from "next/server"
import { validateCredentials, setSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, senha } = body

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha sao obrigatorios" },
        { status: 400 }
      )
    }

    const user = validateCredentials(email, senha)
    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      )
    }

    await setSession(user)

    const redirect = user.role === "admin" ? "/admin" : "/painel"

    return NextResponse.json({ success: true, redirect, role: user.role })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
