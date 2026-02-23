"use client"

import { useState } from "react"
import { useTenant } from "@/hooks/use-tenant"
import type { Frete } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Truck } from "lucide-react"
import { toast } from "sonner"

export default function FretePage() {
  const { fretes: initialFretes } = useTenant()
  const [fretes, setFretes] = useState<Frete[]>(initialFretes)
  const [editando, setEditando] = useState<Frete | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditando({
      id: Date.now(),
      relEstabelecimentosId: "1",
      nome: "",
      valor: 0,
      outros: "0",
    })
  }

  function salvar() {
    if (!editando) return
    if (!editando.nome.trim()) {
      toast.error("Nome do frete e obrigatorio")
      return
    }
    if (isNew) {
      setFretes((prev) => [...prev, editando])
      toast.success("Frete criado")
    } else {
      setFretes((prev) =>
        prev.map((f) => (f.id === editando.id ? editando : f))
      )
      toast.success("Frete atualizado")
    }
    setEditando(null)
    setIsNew(false)
  }

  function excluir(id: number) {
    setFretes((prev) => prev.filter((f) => f.id !== id))
    toast.success("Frete removido")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Frete</h1>
          <p className="text-sm text-muted-foreground">Configure os valores de entrega por regiao</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Regiao
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {fretes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Truck className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhuma regiao de frete</p>
            </CardContent>
          </Card>
        ) : (
          fretes.map((frete) => (
            <Card key={frete.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{frete.nome}</p>
                  <p className="text-sm font-bold text-primary">R$ {frete.valor.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setIsNew(false); setEditando({ ...frete }) }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => excluir(frete.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editando} onOpenChange={() => { setEditando(null); setIsNew(false) }}>
        <DialogContent className="max-w-sm">
          {editando && (
            <>
              <DialogHeader>
                <DialogTitle>{isNew ? "Nova Regiao" : "Editar Frete"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="frete-nome">Bairro / Regiao</Label>
                  <Input
                    id="frete-nome"
                    value={editando.nome}
                    onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                    placeholder="Ex: Centro"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="frete-valor">Valor (R$)</Label>
                  <Input
                    id="frete-valor"
                    type="number"
                    step="0.01"
                    value={editando.valor}
                    onChange={(e) => setEditando({ ...editando, valor: parseFloat(e.target.value) || 0 })}
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
