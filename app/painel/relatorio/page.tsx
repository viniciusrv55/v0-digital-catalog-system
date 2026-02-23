"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPedidos } from "@/lib/mock-data"
import { PEDIDO_STATUS_LABELS, FORMA_PAGAMENTO_LABELS, type PedidoStatus } from "@/lib/types"
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react"

export default function RelatorioPage() {
  const pedidos = mockPedidos
  const total = pedidos.reduce((sum, p) => sum + p.vPedido + p.taxa, 0)
  const concluidos = pedidos.filter((p) => p.status === "5")
  const cancelados = pedidos.filter((p) => p.status === "6")
  const ticketMedio = concluidos.length > 0
    ? concluidos.reduce((sum, p) => sum + p.vPedido + p.taxa, 0) / concluidos.length
    : 0

  // Payment method breakdown
  const pagamentoBreakdown = pedidos.reduce<Record<string, number>>((acc, p) => {
    const key = p.formaPagamento || "N/A"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Status breakdown
  const statusBreakdown = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  // Delivery type breakdown
  const entregaBreakdown = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.formaEntrega] = (acc[p.formaEntrega] || 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatorio</h1>
        <p className="text-sm text-muted-foreground">Visao geral do desempenho</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl font-bold text-foreground">{pedidos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold text-foreground">R$ {total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Medio</p>
              <p className="text-2xl font-bold text-foreground">R$ {ticketMedio.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelamentos</p>
              <p className="text-2xl font-bold text-foreground">{cancelados.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {PEDIDO_STATUS_LABELS[status as PedidoStatus] || status}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / pedidos.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.entries(pagamentoBreakdown).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {FORMA_PAGAMENTO_LABELS[method] || method}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / pedidos.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forma de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.entries(entregaBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm capitalize text-foreground">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / pedidos.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
