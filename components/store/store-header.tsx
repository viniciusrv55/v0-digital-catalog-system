"use client"

import type { Estabelecimento } from "@/lib/types"
import { isStoreOpen } from "@/lib/store-utils"
import { MapPin, Clock } from "lucide-react"

interface StoreHeaderProps {
  loja: Estabelecimento
}

export function StoreHeader({ loja }: StoreHeaderProps) {
  const open = isStoreOpen(loja.horarios)
  const isManualClosed = loja.funcionamento === "2"
  const storeIsOpen = open && !isManualClosed

  return (
    <header className="relative">
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden md:h-56">
        {loja.capa ? (
          <img
            src={loja.capa}
            alt={`Capa de ${loja.nome}`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: loja.cor }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Store Info */}
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="flex items-end gap-4 -mt-12">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="h-24 w-24 overflow-hidden rounded-2xl border-4 shadow-lg"
              style={{ borderColor: loja.cor }}
            >
              {loja.perfil ? (
                <img
                  src={loja.perfil}
                  alt={loja.nome}
                  className="h-full w-full object-cover bg-card"
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: loja.cor }}
                >
                  {loja.nome?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground md:text-2xl text-balance">
                {loja.nome}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  storeIsOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    storeIsOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {storeIsOpen ? "Aberto" : "Fechado"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
              {loja.descricao}
            </p>
          </div>
        </div>

        {/* Details bar */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {loja.enderecoBairro && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {loja.enderecoBairro}, {loja.cidade}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {"30-50 min"}
          </span>
          {loja.pedidoMinimo > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {"Min. R$ "}
              {loja.pedidoMinimo.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
