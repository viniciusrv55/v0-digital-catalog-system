import { NextResponse } from "next/server"
import { setSession } from "@/lib/auth"
import type { SessionPayload } from "@/lib/auth"

// In production this would check a real DB. For now we use an in-memory list
// that mirrors mockCuponsTrial + mockUsuarios from mock-data.
const VALID_COUPONS: Record<string, { diasTrial: number; usado: boolean }> = {
  "TRIAL-DEMO-30D": { diasTrial: 30, usado: false },
  "TRIAL-VIP-60D": { diasTrial: 60, usado: false },
}

const EXISTING_EMAILS = new Set([
  "admin@zapmaxx.com.br",
  "joao@pizzadaboa.com",
  "maria@acaipower.com",
  "carlos@bklab.com",
  "ana@sushitokyo.com",
  "pedro@cafearoma.com",
])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, senha, nomeLoja, cupom } = body as {
      nome?: string
      email?: string
      senha?: string
      nomeLoja?: string
      cupom?: string
    }

    // Validation
    if (!nome?.trim() || !email?.trim() || !senha?.trim() || !nomeLoja?.trim() || !cupom?.trim()) {
      return NextResponse.json(
        { error: "Todos os campos sao obrigatorios" },
        { status: 400 }
      )
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Check email
    if (EXISTING_EMAILS.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: "Este email ja esta cadastrado" },
        { status: 409 }
      )
    }

    // Validate coupon
    const couponCode = cupom.toUpperCase().trim()
    const couponData = VALID_COUPONS[couponCode]

    if (!couponData) {
      return NextResponse.json(
        { error: "Cupom de trial invalido" },
        { status: 400 }
      )
    }

    if (couponData.usado) {
      return NextResponse.json(
        { error: "Este cupom ja foi utilizado" },
        { status: 400 }
      )
    }

    // Mark coupon as used
    couponData.usado = true
    EXISTING_EMAILS.add(email.toLowerCase())

    // Calculate trial end date
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + couponData.diasTrial)

    // Create session
    const session: SessionPayload = {
      id: Date.now(),
      email: email.toLowerCase(),
      role: "owner",
      nome: nome.trim(),
      trialEndsAt: trialEnd.toISOString().split("T")[0],
    }

    await setSession(session)

    return NextResponse.json({
      success: true,
      redirect: "/painel",
      trialEndsAt: session.trialEndsAt,
      diasTrial: couponData.diasTrial,
    })
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
