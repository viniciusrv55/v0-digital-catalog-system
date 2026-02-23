"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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
  Save,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  CreditCard,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"
import { mockPlataformaConfig } from "@/lib/mock-data"
import type { Pixel, PixelProvider } from "@/lib/types"
import { PIXEL_PROVIDER_LABELS } from "@/lib/types"

export default function AdminConfiguracoesPage() {
  // ASAAS global
  const [asaasApiKey, setAsaasApiKey] = useState(
    mockPlataformaConfig.asaasApiKeyGlobal || ""
  )
  const [asaasSandbox, setAsaasSandbox] = useState(
    mockPlataformaConfig.asaasSandboxGlobal
  )
  const [showApiKey, setShowApiKey] = useState(false)

  // Pixels
  const [pixels, setPixels] = useState<Pixel[]>(mockPlataformaConfig.pixels)
  const [pixelDialogOpen, setPixelDialogOpen] = useState(false)
  const [editingPixel, setEditingPixel] = useState<Pixel | null>(null)
  const [pixelForm, setPixelForm] = useState({
    provider: "facebook" as PixelProvider,
    pixelId: "",
    label: "",
    ativo: true,
  })

  function salvarAsaas() {
    toast.success("Credenciais ASAAS salvas com sucesso")
  }

  // Pixel CRUD
  function openPixelCreate() {
    setEditingPixel(null)
    setPixelForm({ provider: "facebook", pixelId: "", label: "", ativo: true })
    setPixelDialogOpen(true)
  }

  function openPixelEdit(pixel: Pixel) {
    setEditingPixel(pixel)
    setPixelForm({
      provider: pixel.provider,
      pixelId: pixel.pixelId,
      label: pixel.label || "",
      ativo: pixel.ativo,
    })
    setPixelDialogOpen(true)
  }

  function salvarPixel() {
    if (!pixelForm.pixelId.trim()) {
      toast.error("ID do pixel e obrigatorio")
      return
    }
    if (editingPixel) {
      setPixels((prev) =>
        prev.map((p) =>
          p.id === editingPixel.id ? { ...p, ...pixelForm } : p
        )
      )
      toast.success("Pixel atualizado")
    } else {
      const newId = Math.max(...pixels.map((p) => p.id), 0) + 1
      setPixels((prev) => [...prev, { id: newId, ...pixelForm }])
      toast.success("Pixel adicionado")
    }
    setPixelDialogOpen(false)
  }

  function removerPixel(id: number) {
    setPixels((prev) => prev.filter((p) => p.id !== id))
    toast.success("Pixel removido")
  }

  function togglePixelAtivo(id: number) {
    setPixels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">
          Configuracoes globais da plataforma ZapMaxx
        </p>
      </div>

      {/* ASAAS Credentials */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">Credenciais ASAAS</CardTitle>
            <p className="text-xs text-muted-foreground">
              Chave de API global para pagamentos online via ASAAS
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="asaas-key">API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="asaas-key"
                type={showApiKey ? "text" : "password"}
                value={asaasApiKey}
                onChange={(e) => setAsaasApiKey(e.target.value)}
                placeholder="$aact_..."
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Modo Sandbox
              </p>
              <p className="text-xs text-muted-foreground">
                Ativar para testes (nao gera cobrancas reais)
              </p>
            </div>
            <Switch
              checked={asaasSandbox}
              onCheckedChange={setAsaasSandbox}
            />
          </div>
          {asaasSandbox && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
              Modo sandbox ativo. Pagamentos nao serao cobrados. Use para
              desenvolvimento e testes.
            </div>
          )}
          <Button onClick={salvarAsaas} className="gap-2 self-end">
            <Save className="h-4 w-4" />
            Salvar Credenciais
          </Button>
        </CardContent>
      </Card>

      {/* Platform Pixels */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                Pixels da Plataforma
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pixels de rastreamento globais (aplicados em toda a
                plataforma)
              </p>
            </div>
          </div>
          <Button onClick={openPixelCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {pixels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="mb-2 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Nenhum pixel configurado
              </p>
            </div>
          ) : (
            pixels.map((pixel) => (
              <div
                key={pixel.id}
                className="flex items-center justify-between rounded-xl bg-muted p-4"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {pixel.label || PIXEL_PROVIDER_LABELS[pixel.provider]}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                      >
                        {PIXEL_PROVIDER_LABELS[pixel.provider]}
                      </Badge>
                      {!pixel.ativo && (
                        <Badge
                          variant="secondary"
                          className="border-0 bg-red-100 text-[10px] text-red-800"
                        >
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {pixel.pixelId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Switch
                    checked={pixel.ativo}
                    onCheckedChange={() => togglePixelAtivo(pixel.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openPixelEdit(pixel)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removerPixel(pixel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pixel Dialog */}
      <Dialog open={pixelDialogOpen} onOpenChange={setPixelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPixel ? "Editar Pixel" : "Adicionar Pixel"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Provedor</Label>
              <Select
                value={pixelForm.provider}
                onValueChange={(val) =>
                  setPixelForm({
                    ...pixelForm,
                    provider: val as PixelProvider,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook Pixel</SelectItem>
                  <SelectItem value="google_analytics">
                    Google Analytics
                  </SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok Pixel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="px-id">ID do Pixel</Label>
              <Input
                id="px-id"
                value={pixelForm.pixelId}
                onChange={(e) =>
                  setPixelForm({ ...pixelForm, pixelId: e.target.value })
                }
                placeholder={
                  pixelForm.provider === "google_analytics"
                    ? "G-XXXXXXXXXX"
                    : pixelForm.provider === "facebook"
                      ? "123456789012345"
                      : "ID do pixel"
                }
                className="font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="px-label">Label (opcional)</Label>
              <Input
                id="px-label"
                value={pixelForm.label}
                onChange={(e) =>
                  setPixelForm({ ...pixelForm, label: e.target.value })
                }
                placeholder="Nome de identificacao"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <span className="text-sm text-foreground">Ativo</span>
              <Switch
                checked={pixelForm.ativo}
                onCheckedChange={(val) =>
                  setPixelForm({ ...pixelForm, ativo: val })
                }
              />
            </div>
            <Button onClick={salvarPixel} className="w-full">
              {editingPixel ? "Salvar Alteracoes" : "Adicionar Pixel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
