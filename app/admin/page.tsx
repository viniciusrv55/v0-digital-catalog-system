"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Users, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react"

const stats = [
  { title: "Estabelecimentos", value: "127", change: "+12 este mes", icon: Store, color: "bg-blue-100 text-blue-700" },
  { title: "Usuarios", value: "89", change: "+8 este mes", icon: Users, color: "bg-green-100 text-green-700" },
  { title: "Assinaturas Ativas", value: "94", change: "74% do total", icon: CreditCard, color: "bg-orange-100 text-orange-700" },
  { title: "MRR", value: "R$ 7.450", change: "+15% vs anterior", icon: TrendingUp, color: "bg-primary/10 text-primary" },
]

const recentEstabs = [
  { id: 1, nome: "Pizza da Boa", subdominio: "pizzadaboa", plano: "Essencial", status: "1", cidade: "Sao Paulo" },
  { id: 2, nome: "Acai Power", subdominio: "acaipower", plano: "Profissional", status: "1", cidade: "Rio de Janeiro" },
  { id: 3, nome: "Burger King Lab", subdominio: "burgerkinglab", plano: "Gratis", status: "1", cidade: "Belo Horizonte" },
  { id: 4, nome: "Sushi Tokyo", subdominio: "sushitokyo", plano: "Essencial", status: "2", cidade: "Curitiba" },
  { id: 5, nome: "Cafe Aroma", subdominio: "cafearoma", plano: "Profissional", status: "1", cidade: "Salvador" },
]

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-sm text-muted-foreground">Visao geral da plataforma ZapMaxx</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Estabelecimentos Recentes</CardTitle>
          <a
            href="/admin/estabelecimentos"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Subdominio</th>
                  <th className="px-5 py-3">Cidade</th>
                  <th className="px-5 py-3">Plano</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEstabs.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{e.nome}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {e.subdominio}.zapmaxx.com.br
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.cidade}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className="text-xs">{e.plano}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="secondary"
                        className={`border-0 text-xs ${
                          e.status === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {e.status === "1" ? "Ativo" : "Inativo"}
                      </Badge>
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
