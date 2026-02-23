"use client"

import { useState } from "react"
import { mockLoja, mockPixelsLoja } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { toast } from "sonner"
import { Save, Plus, Pencil, Trash2, BarChart3 } from "lucide-react"
import type { Pixel, PixelProvider } from "@/lib/types"
import { PIXEL_PROVIDER_LABELS } from "@/lib/types"

export default function ConfiguracoesPage() {
  const [loja, setLoja] = useState(mockLoja)

  // Pixels state
  const [pixels, setPixels] = useState<Pixel[]>(mockPixelsLoja)
  const [pixelDialogOpen, setPixelDialogOpen] = useState(false)
  const [editingPixel, setEditingPixel] = useState<Pixel | null>(null)
  const [pixelForm, setPixelForm] = useState({
    provider: "facebook" as PixelProvider,
    pixelId: "",
    label: "",
    ativo: true,
  })

  function salvar() {
    toast.success("Configuracoes salvas com sucesso")
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
      setPixels((prev) => [
        ...prev,
        { id: newId, relEstabelecimentosId: "1", ...pixelForm },
      ])
      toast.success("Pixel adicionado")
    }
    setPixelDialogOpen(false)
  }

  function removerPixel(id: number) {
    setPixels((prev) => prev.filter((p) => p.id !== id))
    toast.success("Pixel removido")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-sm text-muted-foreground">Configure sua loja</p>
        </div>
        <Button onClick={salvar} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </div>

      {/* General info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informacoes Gerais</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-nome">Nome da Loja</Label>
              <Input
                id="conf-nome"
                value={loja.nome}
                onChange={(e) => setLoja({ ...loja, nome: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-seg">Segmento</Label>
              <Input
                id="conf-seg"
                value={loja.segmento || ""}
                onChange={(e) => setLoja({ ...loja, segmento: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="conf-desc">Descricao</Label>
            <Textarea
              id="conf-desc"
              value={loja.descricao || ""}
              onChange={(e) => setLoja({ ...loja, descricao: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-cor">Cor Principal</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={loja.cor}
                  onChange={(e) => setLoja({ ...loja, cor: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border"
                />
                <Input
                  id="conf-cor"
                  value={loja.cor}
                  onChange={(e) => setLoja({ ...loja, cor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-cidade">Cidade</Label>
              <Input
                id="conf-cidade"
                value={loja.cidade || ""}
                onChange={(e) => setLoja({ ...loja, cidade: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-estado">Estado</Label>
              <Input
                id="conf-estado"
                value={loja.estado || ""}
                onChange={(e) => setLoja({ ...loja, estado: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contato</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-wpp">WhatsApp</Label>
              <Input
                id="conf-wpp"
                value={loja.contatoWhatsapp || ""}
                onChange={(e) => setLoja({ ...loja, contatoWhatsapp: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-email">Email</Label>
              <Input
                id="conf-email"
                type="email"
                value={loja.contatoEmail || ""}
                onChange={(e) => setLoja({ ...loja, contatoEmail: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-insta">Instagram</Label>
              <Input
                id="conf-insta"
                value={loja.contatoInstagram || ""}
                onChange={(e) => setLoja({ ...loja, contatoInstagram: e.target.value })}
                placeholder="@sualoja"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-fb">Facebook</Label>
              <Input
                id="conf-fb"
                value={loja.contatoFacebook || ""}
                onChange={(e) => setLoja({ ...loja, contatoFacebook: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery modes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formas de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            { key: "delivery" as const, label: "Delivery", desc: "Entrega no endereco do cliente" },
            { key: "retirada" as const, label: "Retirada", desc: "Cliente retira no local" },
            { key: "balcao" as const, label: "Balcao", desc: "Consumo no balcao" },
            { key: "mesa" as const, label: "Mesa", desc: "Consumo na mesa" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl bg-muted p-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={loja[item.key] === "1"}
                onCheckedChange={(val) =>
                  setLoja({ ...loja, [item.key]: val ? "1" : "2" })
                }
              />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <Label htmlFor="conf-pedmin">Pedido Minimo (R$)</Label>
            <Input
              id="conf-pedmin"
              type="number"
              step="0.01"
              value={loja.pedidoMinimo}
              onChange={(e) => setLoja({ ...loja, pedidoMinimo: parseFloat(e.target.value) || 0 })}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            { key: "pagamentoDinheiro" as const, label: "Dinheiro" },
            { key: "pagamentoCartaoDebito" as const, label: "Cartao de Debito" },
            { key: "pagamentoCartaoCredito" as const, label: "Cartao de Credito" },
            { key: "pagamentoCartaoAlimentacao" as const, label: "Cartao Alimentacao" },
            { key: "pagamentoPix" as const, label: "PIX" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl bg-muted p-4"
            >
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <Switch
                checked={loja[item.key] === "1"}
                onCheckedChange={(val) =>
                  setLoja({ ...loja, [item.key]: val ? "1" : "2" })
                }
              />
            </div>
          ))}
          {loja.pagamentoPix === "1" && (
            <>
              <Separator />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label>Tipo da Chave PIX</Label>
                  <Select
                    value={loja.tipopix || "telefone"}
                    onValueChange={(val) => setLoja({ ...loja, tipopix: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="aleatoria">Chave Aleatoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="conf-chavepix">Chave PIX</Label>
                  <Input
                    id="conf-chavepix"
                    value={loja.chavePix || ""}
                    onChange={(e) => setLoja({ ...loja, chavePix: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="conf-benpix">Beneficiario</Label>
                  <Input
                    id="conf-benpix"
                    value={loja.beneficiarioPix || ""}
                    onChange={(e) => setLoja({ ...loja, beneficiarioPix: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endereco</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-cep">CEP</Label>
              <Input
                id="conf-cep"
                value={loja.enderecoCep || ""}
                onChange={(e) => setLoja({ ...loja, enderecoCep: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-rua">Rua</Label>
              <Input
                id="conf-rua"
                value={loja.enderecoRua || ""}
                onChange={(e) => setLoja({ ...loja, enderecoRua: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-num">Numero</Label>
              <Input
                id="conf-num"
                value={loja.enderecoNumero || ""}
                onChange={(e) => setLoja({ ...loja, enderecoNumero: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-bairro">Bairro</Label>
              <Input
                id="conf-bairro"
                value={loja.enderecoBairro || ""}
                onChange={(e) => setLoja({ ...loja, enderecoBairro: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conf-comp">Complemento</Label>
              <Input
                id="conf-comp"
                value={loja.enderecoComplemento || ""}
                onChange={(e) => setLoja({ ...loja, enderecoComplemento: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pixels / Rastreamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Pixels e Rastreamento</CardTitle>
              <p className="text-xs text-muted-foreground">
                Adicione pixels de rastreamento para sua loja
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
              <p className="text-xs text-muted-foreground">
                Adicione pixels do Facebook, Google Analytics, etc.
              </p>
            </div>
          ) : (
            pixels.map((pixel) => (
              <div
                key={pixel.id}
                className="flex items-center justify-between rounded-xl bg-muted p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {pixel.label || PIXEL_PROVIDER_LABELS[pixel.provider]}
                    </p>
                    <Badge variant="outline" className="text-[10px]">
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
                <div className="flex items-center gap-1">
                  <Switch
                    checked={pixel.ativo}
                    onCheckedChange={() => {
                      setPixels((prev) =>
                        prev.map((p) =>
                          p.id === pixel.id ? { ...p, ativo: !p.ativo } : p
                        )
                      )
                    }}
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
              <Label htmlFor="px-id-store">ID do Pixel</Label>
              <Input
                id="px-id-store"
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
              <Label htmlFor="px-label-store">Label (opcional)</Label>
              <Input
                id="px-label-store"
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
