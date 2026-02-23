"use client"

import useSWR from "swr"
import type {
  Estabelecimento,
  Categoria,
  Produto,
  Banner,
  Frete,
  Cupom,
  Pedido,
} from "@/lib/types"
import type { AuthUser } from "@/lib/auth-store"

interface TenantPayload {
  user: AuthUser
  loja: Estabelecimento
  categorias: Categoria[]
  produtos: Produto[]
  banners: Banner[]
  fretes: Frete[]
  cupons: Cupom[]
  pedidos: Pedido[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 401) {
      // Session expired — hard redirect to login
      window.location.href = "/login"
      throw new Error("Sessao expirada")
    }
    throw new Error("Erro ao carregar dados do tenant")
  }
  return res.json() as Promise<TenantPayload>
}

export function useTenant() {
  const { data, error, isLoading, mutate } = useSWR<TenantPayload>(
    "/api/tenant",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  return {
    user: data?.user ?? null,
    loja: data?.loja ?? null,
    categorias: data?.categorias ?? [],
    produtos: data?.produtos ?? [],
    banners: data?.banners ?? [],
    fretes: data?.fretes ?? [],
    cupons: data?.cupons ?? [],
    pedidos: data?.pedidos ?? [],
    isLoading,
    error,
    mutate,
  }
}
