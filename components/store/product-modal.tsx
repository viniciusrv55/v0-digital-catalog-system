"use client"

import { useState } from "react"
import type { Produto, VariacaoGrupo } from "@/lib/types"
import { formatCurrency, parseVariacoes } from "@/lib/store-utils"
import { useCartStore } from "@/lib/cart-store"
import { X, Minus, Plus, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface ProductModalProps {
  produto: Produto
  storeColor: string
  onClose: () => void
}

export function ProductModal({ produto, storeColor, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [quantity, setQuantity] = useState(1)
  const [observacao, setObservacao] = useState("")
  const [selectedVariacoes, setSelectedVariacoes] = useState<
    Record<string, { nome: string; valor: number }[]>
  >({})

  const variacoes: VariacaoGrupo[] = parseVariacoes(produto.variacao)
  const hasPromo = produto.oferta === "1" && produto.valorPromocional != null
  const basePrice = hasPromo ? produto.valorPromocional! : produto.valor

  const variacaoExtra = Object.values(selectedVariacoes)
    .flat()
    .reduce((sum, v) => sum + (v.valor || 0), 0)

  const totalPrice = (basePrice + variacaoExtra) * quantity

  const handleVariacaoSelect = (
    grupoNome: string,
    item: { nome: string; valor: number },
    maxEscolha: number
  ) => {
    setSelectedVariacoes((prev) => {
      const current = prev[grupoNome] || []
      const exists = current.find((c) => c.nome === item.nome)

      if (exists) {
        return {
          ...prev,
          [grupoNome]: current.filter((c) => c.nome !== item.nome),
        }
      }

      if (maxEscolha === 1) {
        return { ...prev, [grupoNome]: [item] }
      }

      if (current.length >= maxEscolha) {
        return { ...prev, [grupoNome]: [...current.slice(1), item] }
      }

      return { ...prev, [grupoNome]: [...current, item] }
    })
  }

  const canAdd = () => {
    for (const grupo of variacoes) {
      const min = parseInt(grupo.escolha_minima) || 0
      const selected = selectedVariacoes[grupo.nome]?.length || 0
      if (selected < min) return false
    }
    return true
  }

  const handleAdd = () => {
    if (!canAdd()) {
      toast.error("Selecione as opcoes obrigatorias")
      return
    }

    const cartVariacoes = Object.entries(selectedVariacoes).map(
      ([grupoNome, escolhas]) => ({
        grupoNome,
        escolhas,
      })
    )

    addItem({
      produtoId: produto.id,
      nome: produto.nome,
      imagem: produto.destaque,
      quantidade: quantity,
      valorUnitario: basePrice,
      observacao: observacao || undefined,
      variacoes: cartVariacoes.length > 0 ? cartVariacoes : undefined,
    })

    toast.success(`${produto.nome} adicionado a sacola!`)
    onClose()
    openCart()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card md:rounded-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 shadow-md backdrop-blur-sm"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-card-foreground" />
        </button>

        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden md:rounded-t-2xl">
          {produto.destaque ? (
            <img
              src={produto.destaque}
              alt={produto.nome}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Name and Price */}
          <h2 className="text-xl font-bold text-card-foreground">{produto.nome}</h2>
          {produto.descricao && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {produto.descricao}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {hasPromo && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(produto.valor)}
              </span>
            )}
            <span className="text-lg font-bold" style={{ color: storeColor }}>
              {formatCurrency(basePrice)}
            </span>
          </div>

          {/* Variacoes */}
          {variacoes.map((grupo: VariacaoGrupo) => {
            const min = parseInt(grupo.escolha_minima) || 0
            const max = parseInt(grupo.escolha_maxima) || 1
            const selected = selectedVariacoes[grupo.nome] || []

            return (
              <div key={grupo.nome} className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-card-foreground">{grupo.nome}</h3>
                  <span className="text-xs text-muted-foreground">
                    {min > 0 ? "Obrigatorio" : "Opcional"}
                    {" - "}
                    {max === 1 ? "Escolha 1" : `Ate ${max}`}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {grupo.item.map((item) => {
                    const isSelected = selected.some((s) => s.nome === item.nome)
                    const val = parseFloat(item.valor || "0")

                    return (
                      <button
                        key={item.nome}
                        onClick={() =>
                          handleVariacaoSelect(grupo.nome, { nome: item.nome, valor: val }, max)
                        }
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                          isSelected
                            ? "border-2 bg-card shadow-sm"
                            : "border-border bg-card hover:bg-muted/50"
                        }`}
                        style={
                          isSelected
                            ? { borderColor: storeColor }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                              isSelected ? "border-transparent" : "border-muted-foreground/30"
                            }`}
                            style={
                              isSelected
                                ? { backgroundColor: storeColor }
                                : undefined
                            }
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="text-left">
                            <span className="text-card-foreground">{item.nome}</span>
                            {item.descricao && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({item.descricao})
                              </span>
                            )}
                          </div>
                        </div>
                        {val > 0 && (
                          <span className="text-xs font-medium text-muted-foreground">
                            + {formatCurrency(val)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Observacao */}
          <div className="mt-5">
            <label className="text-sm font-medium text-card-foreground" htmlFor="observacao">
              Observacao
            </label>
            <textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Sem cebola, bem passado..."
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": storeColor } as React.CSSProperties}
              rows={2}
            />
          </div>

          {/* Quantity and Add */}
          <div className="mt-5 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border px-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-semibold text-card-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!canAdd()}
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: storeColor }}
            >
              Adicionar {formatCurrency(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
