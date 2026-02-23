"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { UserPlus, Eye, EyeOff, Ticket, Store } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [nomeLoja, setNomeLoja] = useState("")
  const [cupom, setCupom] = useState("")
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (!nome.trim() || !email.trim() || !senha.trim() || !nomeLoja.trim() || !cupom.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    if (senha.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha,
          nomeLoja: nomeLoja.trim(),
          cupom: cupom.trim().toUpperCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Erro ao criar conta")
        setLoading(false)
        return
      }

      toast.success(
        `Conta criada! Voce tem ${data.diasTrial} dias de acesso ao painel.`
      )
      router.push(data.redirect)
    } catch {
      toast.error("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
            Z
          </div>
          <h1 className="text-xl font-bold text-foreground">ZapMaxx</h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta com cupom de trial
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-nome">Seu Nome</Label>
                <Input
                  id="reg-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="reg-senha"
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-loja">
                  <span className="flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" />
                    Nome da sua Loja
                  </span>
                </Label>
                <Input
                  id="reg-loja"
                  value={nomeLoja}
                  onChange={(e) => setNomeLoja(e.target.value)}
                  placeholder="Ex: Pizzaria do Joao"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-cupom">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="h-3.5 w-3.5" />
                    Cupom de Trial
                  </span>
                </Label>
                <Input
                  id="reg-cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value.toUpperCase())}
                  placeholder="TRIAL-XXXXXX"
                  className="font-mono uppercase"
                />
                <p className="text-[11px] text-muted-foreground">
                  Insira o cupom recebido do administrador para ativar seu periodo de teste.
                </p>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <UserPlus className="h-4 w-4" />
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Ja tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Fazer login
          </Link>
        </div>

        {/* Demo coupon info */}
        <div className="mt-3 rounded-xl border border-border bg-muted p-3 text-center text-xs text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">Cupom de teste</p>
          <p>
            Use o cupom <span className="font-mono font-bold">TRIAL-DEMO-30D</span> para testar
          </p>
        </div>
      </div>
    </div>
  )
}
