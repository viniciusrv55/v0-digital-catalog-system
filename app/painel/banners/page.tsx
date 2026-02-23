"use client"

import { useState } from "react"
import { useTenant } from "@/hooks/use-tenant"
import type { Banner } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function BannersPage() {
  const { banners: initialBanners } = useTenant()
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [editando, setEditando] = useState<Banner | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditando({
      id: Date.now(),
      relEstabelecimentosId: "1",
      titulo: "",
      mobile: "",
      status: "1",
    })
  }

  function salvar() {
    if (!editando) return
    if (!editando.mobile.trim()) {
      toast.error("URL da imagem mobile e obrigatoria")
      return
    }
    if (isNew) {
      setBanners((prev) => [...prev, editando])
      toast.success("Banner criado com sucesso")
    } else {
      setBanners((prev) =>
        prev.map((b) => (b.id === editando.id ? editando : b))
      )
      toast.success("Banner atualizado")
    }
    setEditando(null)
    setIsNew(false)
  }

  function excluir(id: number) {
    setBanners((prev) => prev.filter((b) => b.id !== id))
    toast.success("Banner removido")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">{banners.length} banners</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {banners.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum banner</p>
            </CardContent>
          </Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="relative aspect-[2/1]">
                <img
                  src={banner.mobile}
                  alt={banner.titulo || "Banner"}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                {banner.status !== "1" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-foreground">Inativo</span>
                  </div>
                )}
              </div>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{banner.titulo || "Sem titulo"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={banner.status === "1"}
                    onCheckedChange={() =>
                      setBanners((prev) =>
                        prev.map((b) =>
                          b.id === banner.id
                            ? { ...b, status: b.status === "1" ? "2" : "1" }
                            : b
                        )
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setIsNew(false); setEditando({ ...banner }) }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => excluir(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editando} onOpenChange={() => { setEditando(null); setIsNew(false) }}>
        <DialogContent className="max-w-md">
          {editando && (
            <>
              <DialogHeader>
                <DialogTitle>{isNew ? "Novo Banner" : "Editar Banner"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-titulo">Titulo</Label>
                  <Input
                    id="banner-titulo"
                    value={editando.titulo || ""}
                    onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                    placeholder="Titulo do banner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-mobile">URL Imagem Mobile</Label>
                  <Input
                    id="banner-mobile"
                    value={editando.mobile}
                    onChange={(e) => setEditando({ ...editando, mobile: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-desktop">URL Imagem Desktop (opcional)</Label>
                  <Input
                    id="banner-desktop"
                    value={editando.desktop || ""}
                    onChange={(e) => setEditando({ ...editando, desktop: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-link">Link (opcional)</Label>
                  <Input
                    id="banner-link"
                    value={editando.link || ""}
                    onChange={(e) => setEditando({ ...editando, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setEditando(null); setIsNew(false) }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={salvar}>
                    {isNew ? "Criar" : "Salvar"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
