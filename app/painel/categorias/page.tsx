"use client"

import { useState } from "react"
import { mockCategorias } from "@/lib/mock-data"
import type { Categoria } from "@/lib/types"
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
import { Plus, Pencil, Trash2, GripVertical, Tag } from "lucide-react"
import { toast } from "sonner"

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditando({
      id: Date.now(),
      relEstabelecimentosId: "1",
      ordem: categorias.length,
      nome: "",
      visible: "1",
      status: "1",
      domingo: 1, segunda: 1, terca: 1, quarta: 1,
      quinta: 1, sexta: 1, sabado: 1, feriados: 1,
    })
  }

  function salvar() {
    if (!editando) return
    if (!editando.nome.trim()) {
      toast.error("Nome da categoria e obrigatorio")
      return
    }
    if (isNew) {
      setCategorias((prev) => [...prev, editando])
      toast.success("Categoria criada com sucesso")
    } else {
      setCategorias((prev) =>
        prev.map((c) => (c.id === editando.id ? editando : c))
      )
      toast.success("Categoria atualizada")
    }
    setEditando(null)
    setIsNew(false)
  }

  function excluir(id: number) {
    setCategorias((prev) => prev.filter((c) => c.id !== id))
    toast.success("Categoria removida")
  }

  const dias = [
    { key: "domingo", label: "Dom" },
    { key: "segunda", label: "Seg" },
    { key: "terca", label: "Ter" },
    { key: "quarta", label: "Qua" },
    { key: "quinta", label: "Qui" },
    { key: "sexta", label: "Sex" },
    { key: "sabado", label: "Sab" },
    { key: "feriados", label: "Fer" },
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categorias.length} categorias</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {categorias.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhuma categoria</p>
            </CardContent>
          </Card>
        ) : (
          categorias.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground/40" />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{cat.nome}</p>
                  <p className="text-xs text-muted-foreground">Ordem: {cat.ordem}</p>
                </div>
                <Switch
                  checked={cat.status === "1"}
                  onCheckedChange={() => {
                    setCategorias((prev) =>
                      prev.map((c) =>
                        c.id === cat.id
                          ? { ...c, status: c.status === "1" ? "2" : "1" }
                          : c
                      )
                    )
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setIsNew(false); setEditando({ ...cat }) }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => excluir(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
                <DialogTitle>{isNew ? "Nova Categoria" : "Editar Categoria"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cat-nome">Nome</Label>
                  <Input
                    id="cat-nome"
                    value={editando.nome}
                    onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                    placeholder="Nome da categoria"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Dias de exibicao</Label>
                  <div className="flex flex-wrap gap-2">
                    {dias.map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={editando[key] === 1 ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setEditando({
                            ...editando,
                            [key]: editando[key] === 1 ? 0 : 1,
                          })
                        }
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
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
