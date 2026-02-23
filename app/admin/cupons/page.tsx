"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Plus,
  Trash2,
  Ticket,
  Search,
  Copy,
  Check,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { mockCuponsTrial, mockPlanos } from "@/lib/mock-data"
import type { CupomTrial } from "@/lib/types"

function gerarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "TRIAL-"
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function AdminCuponsTrial() {
  const [cupons, setCupons] = useState<CupomTrial[]>(mockCuponsTrial)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filtro, setFiltro] = useState<"all" | "available" | "used" | "expired">("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const [form, setForm] = useState({
    codigo: gerarCodigo(),
    diasTrial: 30,
    relPlanosId: "",
    expiracao: "",
    observacao: "",
  })

  const now = new Date()

  const filtrados = cupons.filter((c) => {
    const matchSearch =
      c.codigo.toLowerCase().includes(search.toLowerCase()) ||
      (c.usadoPor || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.observacao || "").toLowerCase().includes(search.toLowerCase())

    if (!matchSearch) return false

    const isExpired = c.expiracao && new Date(c.expiracao) < now && !c.usado

    if (filtro === "available") return !c.usado && !isExpired
    if (filtro === "used") return c.usado
    if (filtro === "expired") return !!isExpired
    return true
  })

  const totalDisponivel = cupons.filter((c) => !c.usado && !(c.expiracao && new Date(c.expiracao) < now)).length
  const totalUsado = cupons.filter((c) => c.usado).length
  const totalExpirado = cupons.filter((c) => !c.usado && c.expiracao && new Date(c.expiracao) < now).length

  function openCreate() {
    setForm({
      codigo: gerarCodigo(),
      diasTrial: 30,
      relPlanosId: "",
      expiracao: "",
      observacao: "",
    })
    setDialogOpen(true)
  }

  function salvar() {
    if (!form.codigo.trim()) {
      toast.error("Codigo e obrigatorio")
      return
    }
    if (cupons.some((c) => c.codigo === form.codigo)) {
      toast.error("Esse codigo ja existe")
      return
    }
    const newCupom: CupomTrial = {
      id: Math.max(...cupons.map((c) => c.id), 0) + 1,
      codigo: form.codigo.toUpperCase(),
      diasTrial: form.diasTrial,
      relPlanosId: form.relPlanosId || undefined,
      usado: false,
      criadoPor: "admin@zapmaxx.com.br",
      criadoEm: new Date().toISOString(),
      expiracao: form.expiracao || undefined,
      observacao: form.observacao || undefined,
    }
    setCupons((prev) => [newCupom, ...prev])
    setDialogOpen(false)
    toast.success("Cupom de trial criado com sucesso")
  }

  function remover(id: number) {
    setCupons((prev) => prev.filter((c) => c.id !== id))
    toast.success("Cupom removido")
  }

  const copiarCodigo = useCallback((id: number, codigo: string) => {
    navigator.clipboard.writeText(codigo)
    setCopiedId(id)
    toast.success("Codigo copiado!")
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  function getStatusInfo(c: CupomTrial) {
    if (c.usado) {
      return { label: "Utilizado", color: "bg-blue-100 text-blue-800", icon: CheckCircle }
    }
    if (c.expiracao && new Date(c.expiracao) < now) {
      return { label: "Expirado", color: "bg-red-100 text-red-800", icon: AlertCircle }
    }
    return { label: "Disponivel", color: "bg-green-100 text-green-800", icon: Clock }
  }

  function getPlanoNome(planoId?: string) {
    if (!planoId) return null
    const plano = mockPlanos.find((p) => String(p.id) === planoId)
    return plano?.nome || null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupons de Trial</h1>
          <p className="text-sm text-muted-foreground">
            Gere cupons personalizados para dar acesso temporario ao painel
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cupom de Trial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disponiveis</p>
              <p className="text-lg font-bold text-foreground">{totalDisponivel}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Utilizados</p>
              <p className="text-lg font-bold text-foreground">{totalUsado}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expirados</p>
              <p className="text-lg font-bold text-foreground">{totalExpirado}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por codigo, email ou observacao..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "Todos" },
              { key: "available", label: "Disponiveis" },
              { key: "used", label: "Utilizados" },
              { key: "expired", label: "Expirados" },
            ] as const
          ).map((f) => (
            <Button
              key={f.key}
              variant={filtro === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhum cupom encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((cupom) => {
            const statusInfo = getStatusInfo(cupom)
            const StatusIcon = statusInfo.icon
            const planoNome = getPlanoNome(cupom.relPlanosId)

            return (
              <Card key={cupom.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-sm font-bold text-foreground">
                            {cupom.codigo}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`border-0 text-xs ${statusInfo.color}`}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {cupom.diasTrial} dias
                          </Badge>
                          {planoNome && (
                            <Badge variant="outline" className="text-[10px]">
                              {planoNome}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Criado em{" "}
                            {new Date(cupom.criadoEm).toLocaleDateString("pt-BR")}
                          </span>
                          {cupom.usado && cupom.usadoPor && (
                            <span>
                              - Usado por{" "}
                              <span className="font-medium text-foreground">
                                {cupom.usadoPor}
                              </span>{" "}
                              em{" "}
                              {new Date(cupom.usadoEm!).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                          {cupom.expiracao && !cupom.usado && (
                            <span>
                              - Expira em{" "}
                              {new Date(cupom.expiracao).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                        </div>
                        {cupom.observacao && (
                          <p className="mt-1 text-xs text-muted-foreground italic">
                            {cupom.observacao}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!cupom.usado && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => copiarCodigo(cupom.id, cupom.codigo)}
                        >
                          {copiedId === cupom.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {copiedId === cupom.id ? "Copiado" : "Copiar"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remover(cupom.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cupom de Trial</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ct-codigo">Codigo do Cupom</Label>
              <div className="flex gap-2">
                <Input
                  id="ct-codigo"
                  value={form.codigo}
                  onChange={(e) =>
                    setForm({ ...form, codigo: e.target.value.toUpperCase() })
                  }
                  className="flex-1 font-mono uppercase"
                  placeholder="TRIAL-XXXXXX"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({ ...form, codigo: gerarCodigo() })}
                >
                  Gerar
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                O cliente usara este codigo para se cadastrar e ganhar acesso ao painel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="ct-dias">Dias de Trial</Label>
                <Input
                  id="ct-dias"
                  type="number"
                  min={1}
                  max={365}
                  value={form.diasTrial}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      diasTrial: parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Plano</Label>
                <Select
                  value={form.relPlanosId}
                  onValueChange={(val) =>
                    setForm({ ...form, relPlanosId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlanos
                      .filter((p) => p.status === "1")
                      .map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ct-exp">Validade do Cupom (opcional)</Label>
              <Input
                id="ct-exp"
                type="date"
                value={form.expiracao}
                onChange={(e) =>
                  setForm({ ...form, expiracao: e.target.value })
                }
              />
              <p className="text-[11px] text-muted-foreground">
                Ate quando o cupom pode ser utilizado para cadastro. Deixe vazio para sem limite.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ct-obs">Observacao (opcional)</Label>
              <Textarea
                id="ct-obs"
                rows={2}
                value={form.observacao}
                onChange={(e) =>
                  setForm({ ...form, observacao: e.target.value })
                }
                placeholder="Ex: Cupom para o cliente Joao da Pizzaria..."
              />
            </div>

            <Button onClick={salvar} className="w-full">
              Criar Cupom de Trial
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
