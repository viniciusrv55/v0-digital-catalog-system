"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/store-utils"
import { mockLoja } from "@/lib/mock-data"
import { CheckCircle, Clock, Copy, ArrowLeft, QrCode } from "lucide-react"
import { toast } from "sonner"

// Mock payment data for demo
const mockPayment = {
  id: "pay_abc123",
  pedidoId: 1001,
  valor: 93.70,
  status: "pending" as "pending" | "confirmed" | "expired",
  pixCopiaCola: "00020126580014BR.GOV.BCB.PIX01362979a4eb-c382-4f1c-9f00-4c3e5c2d1a2c5204000053039865802BR5925PIZZA DA BOA LTDA6009SAO PAULO62070503***6304B14F",
  pixQrcode: null as string | null,
  expiresAt: new Date(Date.now() + 30 * 60 * 1000),
}

export default function PagamentoPage() {
  const loja = mockLoja
  const [payment, setPayment] = useState(mockPayment)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = payment.expiresAt.getTime() - now.getTime()
      if (diff <= 0) {
        setPayment((p) => ({ ...p, status: "expired" }))
        setTimeLeft("Expirado")
        clearInterval(timer)
        return
      }
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [payment.expiresAt])

  // Simulate payment confirmation after 10s for demo
  useEffect(() => {
    if (payment.status !== "pending") return
    const timer = setTimeout(() => {
      setPayment((p) => ({ ...p, status: "confirmed" }))
      toast.success("Pagamento confirmado!")
    }, 15000)
    return () => clearTimeout(timer)
  }, [payment.status])

  const handleCopy = () => {
    navigator.clipboard.writeText(payment.pixCopiaCola)
    toast.success("Codigo PIX copiado!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <a
            href="/"
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div className="flex items-center gap-2">
            {loja.perfil && (
              <img
                src={loja.perfil}
                alt={loja.nome}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            <h1 className="font-semibold text-card-foreground">{loja.nome}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Payment Status */}
        {payment.status === "confirmed" ? (
          <div className="flex flex-col items-center rounded-2xl bg-green-50 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-xl font-bold text-green-800">Pagamento Confirmado!</h2>
            <p className="mt-2 text-sm text-green-600">
              Seu pedido #{payment.pedidoId} foi pago com sucesso.
            </p>
            <a
              href="/"
              className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: loja.cor }}
            >
              Voltar para a loja
            </a>
          </div>
        ) : payment.status === "expired" ? (
          <div className="flex flex-col items-center rounded-2xl bg-red-50 p-8 text-center">
            <Clock className="h-16 w-16 text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-red-800">Pagamento Expirado</h2>
            <p className="mt-2 text-sm text-red-600">
              O prazo para pagamento expirou. Faca um novo pedido.
            </p>
            <a
              href="/"
              className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: loja.cor }}
            >
              Voltar para a loja
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Timer */}
            <div className="mb-6 flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Expira em {timeLeft}
              </span>
            </div>

            <h2 className="text-lg font-bold text-foreground">Pagamento via PIX</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pedido #{payment.pedidoId} - {formatCurrency(payment.valor)}
            </p>

            {/* QR Code area */}
            <div className="mt-6 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card">
              <div className="flex flex-col items-center gap-2 text-center">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">QR Code PIX</span>
              </div>
            </div>

            {/* Copy and Paste */}
            <div className="mt-6 w-full">
              <label className="text-sm font-medium text-foreground">
                PIX Copia e Cola
              </label>
              <div className="mt-1 flex gap-2">
                <div className="flex-1 truncate rounded-lg border border-border bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                  {payment.pixCopiaCola}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white"
                  style={{ backgroundColor: loja.cor }}
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 w-full rounded-xl bg-muted p-4">
              <h3 className="text-sm font-semibold text-foreground">Como pagar</h3>
              <ol className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: loja.cor }}>
                    1
                  </span>
                  Abra o app do seu banco
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: loja.cor }}>
                    2
                  </span>
                  Escolha pagar com PIX e escaneie o QR Code ou cole o codigo
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: loja.cor }}>
                    3
                  </span>
                  Confirme o pagamento. A confirmacao e automatica!
                </li>
              </ol>
            </div>

            {/* Polling indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: loja.cor }} />
              <span className="text-xs text-muted-foreground">
                Aguardando confirmacao do pagamento...
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
