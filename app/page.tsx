"use client"

import { useState } from "react"
import {
  mockLoja,
  mockCategorias,
  mockProdutos,
  mockBanners,
  mockFretes,
  mockCupons,
} from "@/lib/mock-data"
import type { Produto } from "@/lib/types"
import { StoreHeader } from "@/components/store/store-header"
import { BannerCarousel } from "@/components/store/banner-carousel"
import { CategoryTabs } from "@/components/store/category-tabs"
import { ProductCard } from "@/components/store/product-card"
import { ProductModal } from "@/components/store/product-modal"
import { CartDrawer } from "@/components/store/cart-drawer"
import { FloatingCartButton } from "@/components/store/floating-cart-button"
import { Search, X } from "lucide-react"

export default function StorePage() {
  const loja = mockLoja
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const activeCategorias = mockCategorias
    .filter((c) => c.visible === "1" && c.status === "1")
    .sort((a, b) => a.ordem - b.ordem)

  const filteredProducts = mockProdutos
    .filter((p) => p.visible === "1" && p.status !== "2" && p.statusp === "1")
    .filter((p) => !activeCategory || p.relCategoriasId === String(activeCategory))
    .filter(
      (p) =>
        !searchQuery ||
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => parseInt(a.posicao) - parseInt(b.posicao))

  const groupedProducts = activeCategory
    ? [{ categoria: activeCategorias.find((c) => c.id === activeCategory), produtos: filteredProducts }]
    : activeCategorias.map((cat) => ({
        categoria: cat,
        produtos: filteredProducts.filter((p) => p.relCategoriasId === String(cat.id)),
      })).filter((g) => g.produtos.length > 0)

  return (
    <div
      className="min-h-screen bg-background"
      style={{ "--store-primary": loja.cor } as React.CSSProperties}
    >
      {/* Store Header */}
      <StoreHeader loja={loja} />

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-5">
        {/* Banners */}
        {loja.funcionalidadeBanners === "1" && mockBanners.length > 0 && (
          <div className="mb-5">
            <BannerCarousel banners={mockBanners} loja={loja} />
          </div>
        )}

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          {showSearch ? (
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar no cardapio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery("")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <CategoryTabs
                  categorias={activeCategorias}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  storeColor={loja.cor}
                />
              </div>
              <button
                onClick={() => setShowSearch(true)}
                className="shrink-0 rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Products */}
        {searchQuery && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-muted-foreground">
              {"Nenhum produto encontrado para \""}{searchQuery}{"\""}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-24">
            {groupedProducts.map((group) => (
              <section key={group.categoria?.id || "all"}>
                {!activeCategory && group.categoria && (
                  <h2 className="mb-3 text-lg font-bold text-foreground">
                    {group.categoria.nome}
                  </h2>
                )}
                <div className="flex flex-col gap-3">
                  {group.produtos.map((produto) => (
                    <ProductCard
                      key={produto.id}
                      produto={produto}
                      storeColor={loja.cor}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart */}
      <FloatingCartButton storeColor={loja.cor} />

      {/* Cart Drawer */}
      <CartDrawer loja={loja} fretes={mockFretes} cupons={mockCupons} />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          produto={selectedProduct}
          storeColor={loja.cor}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
