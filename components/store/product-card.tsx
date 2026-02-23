"use client"

import type { Produto } from "@/lib/types"
import { formatCurrency } from "@/lib/store-utils"
import { ImageIcon } from "lucide-react"

interface ProductCardProps {
  produto: Produto
  storeColor: string
  onSelect: (produto: Produto) => void
}

export function ProductCard({ produto, storeColor, onSelect }: ProductCardProps) {
  const hasPromo = produto.oferta === "1" && produto.valorPromocional != null
  const displayPrice = hasPromo ? produto.valorPromocional! : produto.valor
  const isUnavailable = produto.status === "2"

  return (
    <button
      onClick={() => !isUnavailable && onSelect(produto)}
      disabled={isUnavailable}
      className={`group relative flex w-full gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md ${
        isUnavailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground leading-snug">
            {produto.nome}
          </h3>
          {produto.descricao && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {produto.descricao}
            </p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          {hasPromo && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(produto.valor)}
            </span>
          )}
          <span
            className="text-sm font-bold"
            style={{ color: storeColor }}
          >
            {formatCurrency(displayPrice)}
          </span>
          {hasPromo && (
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: storeColor }}
            >
              OFERTA
            </span>
          )}
        </div>
        {isUnavailable && (
          <span className="mt-1 text-xs font-medium text-destructive">
            Indisponivel
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg md:h-28 md:w-28">
        {produto.destaque ? (
          <img
            src={produto.destaque}
            alt={produto.nome}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
    </button>
  )
}
