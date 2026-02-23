"use client"

import { useCartStore } from "@/lib/cart-store"
import { formatCurrency } from "@/lib/store-utils"
import { ShoppingBag } from "lucide-react"

interface FloatingCartButtonProps {
  storeColor: string
}

export function FloatingCartButton({ storeColor }: FloatingCartButtonProps) {
  const openCart = useCartStore((s) => s.openCart)
  const itemCount = useCartStore((s) => s.getItemCount())
  const subtotal = useCartStore((s) => s.getSubtotal())

  if (itemCount === 0) return null

  return (
    <button
      onClick={openCart}
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-6 py-3.5 text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
      style={{ backgroundColor: storeColor }}
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold" style={{ color: storeColor }}>
          {itemCount}
        </span>
      </div>
      <span className="font-semibold">Ver sacola</span>
      <span className="rounded-lg bg-white/20 px-2 py-0.5 text-sm font-bold">
        {formatCurrency(subtotal)}
      </span>
    </button>
  )
}
