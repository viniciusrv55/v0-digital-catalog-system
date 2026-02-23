import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email e obrigatorio" },
        { status: 400 }
      )
    }

    // Check if user exists (in production, send a real email)
    const user = findUserByEmail(email)

    // Always return success to avoid email enumeration
    // In production, send a password reset email if the user exists
    if (user) {
      // TODO: Send password reset email via SMTP service
      console.log(`[Auth] Password reset requested for: ${email}`)
    }

    return NextResponse.json({
      message: "Se o email estiver cadastrado, voce recebera as instrucoes de recuperacao.",
    })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
