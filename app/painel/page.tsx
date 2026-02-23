"use client"

import { useTenant } from "@/hooks/use-tenant"
import { PEDIDO_STATUS_LABELS, PEDIDO_STATUS_COLORS, type PedidoStatus } from "@/lib/types"
import {
  ShoppingBag, Package, DollarSign, TrendingUp, Clock, AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function StatCard({
  title, value, subtitle, icon: Icon, color
}: {
  title: string; value: string; subtitle: string; icon: React.ElementType; color: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PainelHomePage() {
  const { loja, pedidos, produtos, categorias } = useTenant()
  if (!loja) return null

  const pedidosHoje = pedidos.filter((p) => {
    const hoje = new Date().toDateString()
    return new Date(p.dataHora || "").toDateString() === hoje
  })

  const faturamentoHoje = pedidosHoje
    .filter((p) => p.status !== "6")
    .reduce((sum, p) => sum + p.vPedido + p.taxa, 0)

  const aguardando = pedidos.filter((p) => p.status === "1")

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bem-vindo, {loja.nome}</h1>
        <p className="text-sm text-muted-foreground">Aqui esta o resumo da sua loja hoje.</p>
      </div>

      {/* Alert for pending orders */}
      {aguardando.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              {aguardando.length} pedido{aguardando.length > 1 ? "s" : ""} aguardando confirmacao
            </p>
            <p className="text-xs text-yellow-700">
              Acesse a aba Pedidos para gerenciar.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pedidos Hoje"
          value={String(pedidosHoje.length)}
          subtitle={`${pedidos.length} total`}
          icon={ShoppingBag}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Faturamento Hoje"
          value={`R$ ${faturamentoHoje.toFixed(2)}`}
          subtitle="Pedidos concluidos"
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          title="Produtos Ativos"
          value={String(produtos.filter((p) => p.status === "1").length)}
          subtitle={`${categorias.length} categorias`}
          icon={Package}
          color="bg-orange-100 text-orange-700"
        />
        <StatCard
          title="Taxa Conversao"
          value="68%"
          subtitle="Ultimos 7 dias"
          icon={TrendingUp}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Pedidos Recentes</CardTitle>
          <a
            href="/painel/pedidos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Entrega</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Horario</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map((pedido) => (
                  <tr key={pedido.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 text-sm font-semibold">#{pedido.id}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{pedido.nome}</p>
                        <p className="text-xs text-muted-foreground">{pedido.whatsapp}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm capitalize text-muted-foreground">
                      {pedido.formaEntrega}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                      R$ {(pedido.vPedido + pedido.taxa).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="secondary"
                        className={`${PEDIDO_STATUS_COLORS[pedido.status as PedidoStatus]} border-0 text-xs`}
                      >
                        {PEDIDO_STATUS_LABELS[pedido.status as PedidoStatus]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pedido.dataHora
                          ? new Date(pedido.dataHora).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
