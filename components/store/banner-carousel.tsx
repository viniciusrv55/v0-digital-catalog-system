"use client"

import { useState, useCallback, useEffect } from "react"
import type { Estabelecimento, Banner } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BannerCarouselProps {
  banners: Banner[]
  loja: Estabelecimento
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0)
  const activeBanners = banners.filter((b) => b.status === "1")

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % activeBanners.length)
  }, [activeBanners.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length)
  }, [activeBanners.length])

  useEffect(() => {
    if (activeBanners.length <= 1) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next, activeBanners.length])

  if (activeBanners.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="w-full shrink-0">
            <div className="relative aspect-[2/1] md:aspect-[3/1]">
              <img
                src={banner.mobile}
                alt={banner.titulo || "Banner promocional"}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              {banner.titulo && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">{banner.titulo}</h3>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white"
            aria-label="Proximo banner"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Ir para banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
