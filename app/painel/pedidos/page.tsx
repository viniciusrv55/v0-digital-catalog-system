"use client"

import { useState } from "react"
import { useTenant } from "@/hooks/use-tenant"
import {
  PEDIDO_STATUS_LABELS,
  PEDIDO_STATUS_COLORS,
  FORMA_PAGAMENTO_LABELS,
  type PedidoStatus,
} from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Clock, MapPin, Phone, User, Package, DollarSign, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import type { Pedido } from "@/lib/types"

export default function PedidosPage() {
  const { pedidos: initialPedidos } = useTenant()
  const [pedidos, setPedidos] = useState(initialPedidos)
  const [filtro, setFiltro] = useState<string>("todos")
  const [selected, setSelected] = useState<Pedido | null>(null)

  const filtrados = filtro === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === filtro)

  function updateStatus(pedidoId: number, newStatus: string) {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId ? { ...p, status: newStatus } : p
      )
    )
    toast.success(`Pedido #${pedidoId} atualizado para ${PEDIDO_STATUS_LABELS[newStatus as PedidoStatus]}`)
  }

  function enviarWhatsApp(pedido: Pedido) {
    const phone = pedido.whatsapp?.replace(/\D/g, "") || ""
    const msg = encodeURIComponent(
      `Ola ${pedido.nome}! Seu pedido #${pedido.id} esta sendo preparado. Obrigado por escolher nossa loja!`
    )
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground">{pedidos.length} pedidos no total</p>
        </div>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.entries(PEDIDO_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum pedido encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((pedido) => (
            <Card
              key={pedido.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelected(pedido)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-foreground">
                      #{pedido.id}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pedido.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.formaEntrega === "delivery" ? "Delivery" : pedido.formaEntrega === "retirada" ? "Retirada" : pedido.formaEntrega}
                        {" - "}
                        {FORMA_PAGAMENTO_LABELS[pedido.formaPagamento || ""] || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        R$ {(pedido.vPedido + pedido.taxa).toFixed(2)}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {pedido.dataHora
                          ? new Date(pedido.dataHora).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--"}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${PEDIDO_STATUS_COLORS[pedido.status as PedidoStatus]} border-0 text-xs`}
                    >
                      {PEDIDO_STATUS_LABELS[pedido.status as PedidoStatus]}
                    </Badge>
                  </div>
                </div>
                {pedido.json && (
                  <p className="mt-2 text-xs text-muted-foreground">{pedido.json}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Pedido #{selected.id}
                  <Badge
                    variant="secondary"
                    className={`${PEDIDO_STATUS_COLORS[selected.status as PedidoStatus]} border-0 text-xs`}
                  >
                    {PEDIDO_STATUS_LABELS[selected.status as PedidoStatus]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {/* Client info */}
                <div className="flex flex-col gap-2 rounded-xl bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selected.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selected.whatsapp}</span>
                  </div>
                  {selected.formaEntrega === "delivery" && selected.enderecoRua && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>
                        {selected.enderecoRua}, {selected.enderecoNumero}
                        {selected.enderecoBairro && ` - ${selected.enderecoBairro}`}
                        {selected.enderecoCep && ` - CEP: ${selected.enderecoCep}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items */}
                {selected.json && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Itens
                    </p>
                    <div className="rounded-xl border border-border p-3 text-sm text-foreground">
                      {selected.json}
                    </div>
                  </div>
                )}

                {/* Values */}
                <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Produtos</span>
                    <span>R$ {selected.vPedido.toFixed(2)}</span>
                  </div>
                  {selected.taxa > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de entrega</span>
                      <span>R$ {selected.taxa.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
                    <span>Total</span>
                    <span>R$ {(selected.vPedido + selected.taxa).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Atualizar Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PEDIDO_STATUS_LABELS).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selected.status === key ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          updateStatus(selected.id, key)
                          setSelected({ ...selected, status: key })
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => enviarWhatsApp(selected)}
                  className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Enviar WhatsApp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
