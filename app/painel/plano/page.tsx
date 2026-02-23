"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"
import { toast } from "sonner"

const planos = [
  {
    id: 1,
    nome: "Gratis",
    preco: 0,
    mensal: 0,
    features: ["10 produtos", "Catalogo basico", "Pedidos via WhatsApp"],
    limitado: ["Sem banners", "Sem variacoes", "Sem cupons"],
    icon: Zap,
    current: false,
  },
  {
    id: 2,
    nome: "Essencial",
    preco: 49.90,
    mensal: 49.90,
    features: ["50 produtos", "Banners personalizados", "Variacoes de produto", "Cupons de desconto", "Relatorios basicos"],
    limitado: ["Sem pagamento online"],
    icon: Star,
    current: true,
  },
  {
    id: 3,
    nome: "Profissional",
    preco: 99.90,
    mensal: 99.90,
    features: ["Produtos ilimitados", "Banners personalizados", "Variacoes de produto", "Cupons de desconto", "Pagamento online (ASAAS)", "Relatorios avancados", "Suporte prioritario"],
    limitado: [],
    icon: Crown,
    current: false,
  },
]

export default function PlanoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plano</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano e assinatura
        </p>
      </div>

      {/* Current plan notice */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Star className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Seu plano atual: <span className="text-primary">Essencial</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Valido ate 31/12/2026
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {planos.map((plano) => (
          <Card
            key={plano.id}
            className={`relative overflow-hidden ${plano.current ? "ring-2 ring-primary" : ""}`}
          >
            {plano.current && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                Atual
              </div>
            )}
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <plano.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{plano.nome}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">
                  R$ {plano.mensal.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {plano.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground">{f}</span>
                  </div>
                ))}
                {plano.limitado.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-xs text-muted-foreground">
                      -
                    </span>
                    <span className="text-muted-foreground line-through">{f}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={plano.current ? "outline" : "default"}
                className="w-full"
                disabled={plano.current}
                onClick={() => toast.info(`Voce selecionou o plano ${plano.nome}`)}
              >
                {plano.current ? "Plano Atual" : "Selecionar Plano"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
