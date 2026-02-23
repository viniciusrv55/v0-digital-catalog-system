import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { parseSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"
import { getTenantData } from "@/lib/tenant-data"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const user = parseSessionToken(token)
    if (!user) {
      return NextResponse.json({ error: "Sessao invalida" }, { status: 401 })
    }

    if (!user.estabelecimentoId) {
      return NextResponse.json({ error: "Sem estabelecimento vinculado" }, { status: 403 })
    }

    const data = getTenantData(user.estabelecimentoId)
    if (!data) {
      return NextResponse.json({ error: "Estabelecimento nao encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      user,
      loja: data.loja,
      categorias: data.categorias,
      produtos: data.produtos,
      banners: data.banners,
      fretes: data.fretes,
      cupons: data.cupons,
      pedidos: data.pedidos,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
