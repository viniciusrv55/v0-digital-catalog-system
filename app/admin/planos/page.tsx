"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, CreditCard, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { mockPlanos } from "@/lib/mock-data"
import type { Plano } from "@/lib/types"
import { formatCurrency } from "@/lib/store-utils"

const emptyPlano: Omit<Plano, "id"> = {
  nome: "",
  descricao: "",
  duracaoMeses: "1",
  duracaoDias: "30",
  valorTotal: 0,
  valorMensal: 0,
  funcionalidadeMarketplace: "2",
  funcionalidadeVariacao: "2",
  funcionalidadeBanners: "2",
  visible: "1",
  status: "1",
  ordem: "0",
  limiteProdutos: "50",
}

export default function AdminPlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>(mockPlanos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null)
  const [form, setForm] = useState<Omit<Plano, "id">>(emptyPlano)

  function openCreate() {
    setEditingPlano(null)
    setForm(emptyPlano)
    setDialogOpen(true)
  }

  function openEdit(plano: Plano) {
    setEditingPlano(plano)
    setForm({
      nome: plano.nome,
      descricao: plano.descricao,
      duracaoMeses: plano.duracaoMeses,
      duracaoDias: plano.duracaoDias,
      valorTotal: plano.valorTotal,
      valorMensal: plano.valorMensal,
      funcionalidadeMarketplace: plano.funcionalidadeMarketplace,
      funcionalidadeVariacao: plano.funcionalidadeVariacao,
      funcionalidadeBanners: plano.funcionalidadeBanners,
      visible: plano.visible,
      status: plano.status,
      ordem: plano.ordem,
      limiteProdutos: plano.limiteProdutos,
    })
    setDialogOpen(true)
  }

  function salvar() {
    if (!form.nome.trim()) {
      toast.error("Nome do plano e obrigatorio")
      return
    }
    if (editingPlano) {
      setPlanos((prev) =>
        prev.map((p) => (p.id === editingPlano.id ? { ...p, ...form } : p))
      )
      toast.success("Plano atualizado com sucesso")
    } else {
      const newId = Math.max(...planos.map((p) => p.id), 0) + 1
      setPlanos((prev) => [...prev, { id: newId, ...form }])
      toast.success("Plano criado com sucesso")
    }
    setDialogOpen(false)
  }

  function remover(id: number) {
    setPlanos((prev) => prev.filter((p) => p.id !== id))
    toast.success("Plano removido")
  }

  function toggleStatus(id: number) {
    setPlanos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "1" ? "2" : "1" } : p
      )
    )
    toast.success("Status atualizado")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os planos da plataforma ({planos.length} planos)
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {planos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhum plano cadastrado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {planos.map((plano) => (
            <Card key={plano.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {plano.nome}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`border-0 text-xs ${
                            plano.status === "1"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plano.status === "1" ? "Ativo" : "Inativo"}
                        </Badge>
                        {plano.visible === "2" && (
                          <Badge variant="outline" className="text-xs">
                            Oculto
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(plano.valorMensal)}/mes - Ate{" "}
                        {plano.limiteProdutos} produtos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden flex-col items-end gap-0.5 md:flex">
                      <div className="flex items-center gap-1.5">
                        {plano.funcionalidadeMarketplace === "1" && (
                          <Badge variant="outline" className="text-[10px]">
                            Marketplace
                          </Badge>
                        )}
                        {plano.funcionalidadeVariacao === "1" && (
                          <Badge variant="outline" className="text-[10px]">
                            Variacoes
                          </Badge>
                        )}
                        {plano.funcionalidadeBanners === "1" && (
                          <Badge variant="outline" className="text-[10px]">
                            Banners
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(plano)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(plano.id)}
                        className={
                          plano.status === "1"
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }
                      >
                        {plano.status === "1" ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <GripVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPlano ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pl-nome">Nome</Label>
              <Input
                id="pl-nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Essencial"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pl-desc">Descricao</Label>
              <Textarea
                id="pl-desc"
                value={form.descricao || ""}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                rows={2}
                placeholder="Descricao do plano..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pl-valormensal">Valor Mensal (R$)</Label>
                <Input
                  id="pl-valormensal"
                  type="number"
                  step="0.01"
                  value={form.valorMensal}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      valorMensal: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pl-valortotal">Valor Total (R$)</Label>
                <Input
                  id="pl-valortotal"
                  type="number"
                  step="0.01"
                  value={form.valorTotal}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      valorTotal: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pl-limite">Limite de Produtos</Label>
                <Input
                  id="pl-limite"
                  value={form.limiteProdutos}
                  onChange={(e) =>
                    setForm({ ...form, limiteProdutos: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pl-ordem">Ordem</Label>
                <Input
                  id="pl-ordem"
                  value={form.ordem}
                  onChange={(e) =>
                    setForm({ ...form, ordem: e.target.value })
                  }
                  placeholder="1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Funcionalidades</Label>
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="text-sm text-foreground">Marketplace</span>
                <Switch
                  checked={form.funcionalidadeMarketplace === "1"}
                  onCheckedChange={(val) =>
                    setForm({
                      ...form,
                      funcionalidadeMarketplace: val ? "1" : "2",
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="text-sm text-foreground">Variacoes</span>
                <Switch
                  checked={form.funcionalidadeVariacao === "1"}
                  onCheckedChange={(val) =>
                    setForm({
                      ...form,
                      funcionalidadeVariacao: val ? "1" : "2",
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="text-sm text-foreground">Banners</span>
                <Switch
                  checked={form.funcionalidadeBanners === "1"}
                  onCheckedChange={(val) =>
                    setForm({
                      ...form,
                      funcionalidadeBanners: val ? "1" : "2",
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <span className="text-sm text-foreground">Visivel</span>
              <Switch
                checked={form.visible === "1"}
                onCheckedChange={(val) =>
                  setForm({ ...form, visible: val ? "1" : "2" })
                }
              />
            </div>
            <Button onClick={salvar} className="w-full">
              {editingPlano ? "Salvar Alteracoes" : "Criar Plano"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
