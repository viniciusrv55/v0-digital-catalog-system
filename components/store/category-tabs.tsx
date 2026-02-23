"use client"

import { useRef, useEffect, useState } from "react"
import type { Categoria } from "@/lib/types"

interface CategoryTabsProps {
  categorias: Categoria[]
  activeCategory: number | null
  onCategoryChange: (id: number | null) => void
  storeColor: string
}

export function CategoryTabs({
  categorias,
  activeCategory,
  onCategoryChange,
  storeColor,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftShadow, setShowLeftShadow] = useState(false)
  const [showRightShadow, setShowRightShadow] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftShadow(el.scrollLeft > 0)
    setShowRightShadow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    el?.addEventListener("scroll", checkScroll)
    return () => el?.removeEventListener("scroll", checkScroll)
  }, [])

  const active = categorias.filter((c) => c.visible === "1" && c.status === "1")

  return (
    <div className="relative">
      {showLeftShadow && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />
      )}
      {showRightShadow && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        <button
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeCategory === null
              ? "text-white shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          style={
            activeCategory === null
              ? { backgroundColor: storeColor }
              : undefined
          }
        >
          Todos
        </button>
        {active.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            style={
              activeCategory === cat.id
                ? { backgroundColor: storeColor }
                : undefined
            }
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </div>
  )
}
