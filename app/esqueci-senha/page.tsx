"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Informe seu email")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Erro ao enviar email")
        setLoading(false)
        return
      }

      setEnviado(true)
    } catch {
      toast.error("Erro de conexao. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
            Z
          </div>
          <h1 className="text-2xl font-bold text-foreground">ZapMaxx</h1>
          <p className="text-sm text-muted-foreground">Recuperar senha</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {enviado ? "Email Enviado" : "Esqueceu sua senha?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {enviado
                ? "Verifique sua caixa de entrada"
                : "Informe seu email para receber as instrucoes de recuperacao"}
            </p>
          </CardHeader>
          <CardContent>
            {enviado ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground">
                    Se o email <span className="font-semibold">{email}</span> estiver cadastrado,
                    voce recebera as instrucoes de recuperacao de senha.
                  </p>
                </div>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {loading ? "Enviando..." : "Enviar Email de Recuperacao"}
                </Button>

                <Link href="/login" className="w-full">
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o Login
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
