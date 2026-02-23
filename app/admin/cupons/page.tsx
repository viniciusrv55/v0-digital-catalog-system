"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Ticket, Plus, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"

interface AdminCupom {
  id: number
  codigo: string
  desconto: number
  tipo: "percentual" | "fixo"
  usoMaximo: number
  usoAtual: number
  status: "1" | "2"
  validade: string
  estabelecimento: string
}

const mockCupons: AdminCupom[] = [
  { id: 1, codigo: "BEMVINDO10", desconto: 10, tipo: "percentual", usoMaximo: 100, usoAtual: 34, status: "1", validade: "2026-12-31", estabelecimento: "Todos" },
  { id: 2, codigo: "FRETE0", desconto: 5, tipo: "fixo", usoMaximo: 50, usoAtual: 50, status: "2", validade: "2026-06-30", estabelecimento: "Pizza da Boa" },
  { id: 3, codigo: "NATAL25", desconto: 25, tipo: "percentual", usoMaximo: 200, usoAtual: 78, status: "1", validade: "2026-12-25", estabelecimento: "Todos" },
  { id: 4, codigo: "ACAI15", desconto: 15, tipo: "percentual", usoMaximo: 30, usoAtual: 12, status: "1", validade: "2027-03-15", estabelecimento: "Acai Power" },
  { id: 5, codigo: "DESC5REAIS", desconto: 5, tipo: "fixo", usoMaximo: 100, usoAtual: 45, status: "1", validade: "2026-09-01", estabelecimento: "Todos" },
]

const defaultForm = {
  codigo: "",
  desconto: "",
  tipo: "percentual" as "percentual" | "fixo",
  usoMaximo: "",
  validade: "",
  estabelecimento: "Todos",
}

export default function AdminCuponsPage() {
  const [cupons, setCupons] = useState(mockCupons)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(defaultForm)

  const filtrados = cupons.filter(
    (c) =>
      c.codigo.toLowerCase().includes(search.toLowerCase()) ||
      c.estabelecimento.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setEditingId(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  function openEdit(cupom: AdminCupom) {
    setEditingId(cupom.id)
    setForm({
      codigo: cupom.codigo,
      desconto: String(cupom.desconto),
      tipo: cupom.tipo,
      usoMaximo: String(cupom.usoMaximo),
      validade: cupom.validade,
      estabelecimento: cupom.estabelecimento,
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.codigo.trim() || !form.desconto || !form.usoMaximo || !form.validade) {
      toast.error("Preencha todos os campos")
      return
    }

    if (editingId) {
      setCupons((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                codigo: form.codigo.toUpperCase(),
                desconto: Number(form.desconto),
                tipo: form.tipo,
                usoMaximo: Number(form.usoMaximo),
                validade: form.validade,
                estabelecimento: form.estabelecimento,
              }
            : c
        )
      )
      toast.success("Cupom atualizado")
    } else {
      const novo: AdminCupom = {
        id: Date.now(),
        codigo: form.codigo.toUpperCase(),
        desconto: Number(form.desconto),
        tipo: form.tipo,
        usoMaximo: Number(form.usoMaximo),
        usoAtual: 0,
        status: "1",
        validade: form.validade,
        estabelecimento: form.estabelecimento,
      }
      setCupons((prev) => [novo, ...prev])
      toast.success("Cupom criado")
    }
    setDialogOpen(false)
  }

  function handleDelete(id: number) {
    setCupons((prev) => prev.filter((c) => c.id !== id))
    toast.success("Cupom removido")
  }

  function toggleStatus(id: number) {
    setCupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "1" ? "2" : "1" } : c
      )
    )
    toast.success("Status atualizado")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupons</h1>
          <p className="text-sm text-muted-foreground">{cupons.length} cupons cadastrados</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por codigo ou estabelecimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum cupom encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((cupom) => (
            <Card key={cupom.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono text-foreground">{cupom.codigo}</p>
                      <p className="text-xs text-muted-foreground">
                        {cupom.tipo === "percentual" ? `${cupom.desconto}% de desconto` : `R$ ${cupom.desconto.toFixed(2)} de desconto`}
                        {" - "}{cupom.estabelecimento}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uso: {cupom.usoAtual}/{cupom.usoMaximo} - Validade: {new Date(cupom.validade).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`cursor-pointer border-0 text-xs ${
                        cupom.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      onClick={() => toggleStatus(cupom.id)}
                    >
                      {cupom.status === "1" ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cupom)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cupom.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Codigo</Label>
              <Input
                placeholder="Ex: BEMVINDO10"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Desconto</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={form.desconto}
                  onChange={(e) => setForm({ ...form, desconto: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as "percentual" | "fixo" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual (%)</SelectItem>
                    <SelectItem value="fixo">Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Uso Maximo</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={form.usoMaximo}
                  onChange={(e) => setForm({ ...form, usoMaximo: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Validade</Label>
                <Input
                  type="date"
                  value={form.validade}
                  onChange={(e) => setForm({ ...form, validade: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Estabelecimento</Label>
              <Input
                placeholder="Todos (ou nome do estabelecimento)"
                value={form.estabelecimento}
                onChange={(e) => setForm({ ...form, estabelecimento: e.target.value })}
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
