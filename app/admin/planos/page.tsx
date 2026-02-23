"use client"

import { useState } from "react"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { CreditCard, Plus, Pencil, Trash2, Check } from "lucide-react"
import { toast } from "sonner"

interface Plano {
  id: number
  nome: string
  preco: number
  periodo: string
  recursos: string[]
  status: "1" | "2"
  assinantes: number
}

const mockPlanos: Plano[] = [
  {
    id: 1,
    nome: "Gratis",
    preco: 0,
    periodo: "mes",
    recursos: ["Ate 10 produtos", "1 categoria", "Pedidos via WhatsApp"],
    status: "1",
    assinantes: 45,
  },
  {
    id: 2,
    nome: "Essencial",
    preco: 29.9,
    periodo: "mes",
    recursos: ["Ate 50 produtos", "5 categorias", "Cupons de desconto", "Banners", "Relatorios basicos"],
    status: "1",
    assinantes: 52,
  },
  {
    id: 3,
    nome: "Profissional",
    preco: 59.9,
    periodo: "mes",
    recursos: ["Produtos ilimitados", "Categorias ilimitadas", "Cupons de desconto", "Banners", "Relatorios avancados", "Dominio personalizado", "Suporte prioritario"],
    status: "1",
    assinantes: 30,
  },
]

export default function AdminPlanosPage() {
  const [planos, setPlanos] = useState(mockPlanos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ nome: "", preco: "", periodo: "mes", recursos: "" })

  function openNew() {
    setEditingId(null)
    setForm({ nome: "", preco: "", periodo: "mes", recursos: "" })
    setDialogOpen(true)
  }

  function openEdit(plano: Plano) {
    setEditingId(plano.id)
    setForm({
      nome: plano.nome,
      preco: String(plano.preco),
      periodo: plano.periodo,
      recursos: plano.recursos.join("\n"),
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim() || !form.preco) {
      toast.error("Preencha todos os campos")
      return
    }
    if (editingId) {
      setPlanos((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, nome: form.nome, preco: Number(form.preco), periodo: form.periodo, recursos: form.recursos.split("\n").filter(Boolean) }
            : p
        )
      )
      toast.success("Plano atualizado")
    } else {
      const novo: Plano = {
        id: Date.now(),
        nome: form.nome,
        preco: Number(form.preco),
        periodo: form.periodo,
        recursos: form.recursos.split("\n").filter(Boolean),
        status: "1",
        assinantes: 0,
      }
      setPlanos((prev) => [...prev, novo])
      toast.success("Plano criado")
    }
    setDialogOpen(false)
  }

  function handleDelete(id: number) {
    setPlanos((prev) => prev.filter((p) => p.id !== id))
    toast.success("Plano removido")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planos</h1>
          <p className="text-sm text-muted-foreground">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planos.map((plano) => (
          <Card key={plano.id} className="relative overflow-hidden">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{plano.nome}</p>
                    <p className="text-xs text-muted-foreground">{plano.assinantes} assinantes</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`border-0 text-xs ${
                    plano.status === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {plano.status === "1" ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div>
                <p className="text-3xl font-bold text-foreground">
                  {plano.preco === 0 ? "Gratis" : `R$ ${plano.preco.toFixed(2)}`}
                </p>
                {plano.preco > 0 && <p className="text-xs text-muted-foreground">por {plano.periodo}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                {plano.recursos.map((recurso, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {recurso}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-3">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => openEdit(plano)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plano.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Nome do Plano</Label>
              <Input
                placeholder="Ex: Profissional"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Preco (R$)</Label>
                <Input
                  type="number"
                  placeholder="29.90"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Periodo</Label>
                <Input
                  placeholder="mes"
                  value={form.periodo}
                  onChange={(e) => setForm({ ...form, periodo: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Recursos (um por linha)</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={"Ate 50 produtos\n5 categorias\nCupons de desconto"}
                value={form.recursos}
                onChange={(e) => setForm({ ...form, recursos: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingId ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
