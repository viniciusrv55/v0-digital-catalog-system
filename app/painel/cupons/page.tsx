"use client"

import { useState } from "react"
import { mockCupons } from "@/lib/mock-data"
import type { Cupom } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Ticket } from "lucide-react"
import { toast } from "sonner"

export default function CuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>(mockCupons)
  const [editando, setEditando] = useState<Cupom | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditando({
      id: Date.now(),
      relEstabelecimentosId: "1",
      nome: "",
      descricao: "",
      codigo: "",
      tipo: "1",
      descontoPorcentagem: "10",
      quantidade: "100",
      validade: "2026-12-31",
    })
  }

  function salvar() {
    if (!editando) return
    if (!editando.codigo.trim()) {
      toast.error("Codigo do cupom e obrigatorio")
      return
    }
    if (isNew) {
      setCupons((prev) => [...prev, editando])
      toast.success("Cupom criado")
    } else {
      setCupons((prev) =>
        prev.map((c) => (c.id === editando.id ? editando : c))
      )
      toast.success("Cupom atualizado")
    }
    setEditando(null)
    setIsNew(false)
  }

  function excluir(id: number) {
    setCupons((prev) => prev.filter((c) => c.id !== id))
    toast.success("Cupom removido")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupons</h1>
          <p className="text-sm text-muted-foreground">Gerencie cupons de desconto</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {cupons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum cupom</p>
            </CardContent>
          </Card>
        ) : (
          cupons.map((cupom) => (
            <Card key={cupom.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{cupom.nome || cupom.codigo}</p>
                    <Badge variant="outline" className="text-xs font-mono">{cupom.codigo}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cupom.tipo === "1"
                      ? `${cupom.descontoPorcentagem}% de desconto`
                      : `R$ ${(cupom.descontoFixo || 0).toFixed(2)} de desconto`}
                    {cupom.validade && ` - Valido ate ${new Date(cupom.validade).toLocaleDateString("pt-BR")}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setIsNew(false); setEditando({ ...cupom }) }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => excluir(cupom.id)}
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
                <DialogTitle>{isNew ? "Novo Cupom" : "Editar Cupom"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cupom-nome">Nome</Label>
                  <Input
                    id="cupom-nome"
                    value={editando.nome || ""}
                    onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                    placeholder="Ex: Promo 10%"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cupom-codigo">Codigo</Label>
                  <Input
                    id="cupom-codigo"
                    value={editando.codigo}
                    onChange={(e) => setEditando({ ...editando, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ex: PROMO10"
                    className="font-mono uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Tipo</Label>
                    <Select
                      value={editando.tipo}
                      onValueChange={(val) => setEditando({ ...editando, tipo: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Porcentagem</SelectItem>
                        <SelectItem value="2">Valor fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cupom-valor">
                      {editando.tipo === "1" ? "Desconto (%)" : "Desconto (R$)"}
                    </Label>
                    <Input
                      id="cupom-valor"
                      type="number"
                      value={editando.tipo === "1" ? editando.descontoPorcentagem || "" : editando.descontoFixo || ""}
                      onChange={(e) => {
                        if (editando.tipo === "1") {
                          setEditando({ ...editando, descontoPorcentagem: e.target.value })
                        } else {
                          setEditando({ ...editando, descontoFixo: parseFloat(e.target.value) || 0 })
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cupom-qtd">Quantidade</Label>
                    <Input
                      id="cupom-qtd"
                      type="number"
                      value={editando.quantidade || ""}
                      onChange={(e) => setEditando({ ...editando, quantidade: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cupom-val">Validade</Label>
                    <Input
                      id="cupom-val"
                      type="date"
                      value={editando.validade || ""}
                      onChange={(e) => setEditando({ ...editando, validade: e.target.value })}
                    />
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
