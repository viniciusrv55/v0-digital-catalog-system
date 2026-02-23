"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { LogIn, Eye, EyeOff } from "lucide-react"

const MOCK_USERS = [
  { email: "admin@zapmaxx.com.br", senha: "admin123", redirect: "/admin" },
  { email: "joao@pizzadaboa.com", senha: "loja123", redirect: "/painel" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)

    // Mock auth
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email.toLowerCase() && u.senha === senha
      )
      if (user) {
        toast.success("Login realizado com sucesso!")
        router.push(user.redirect)
      } else {
        toast.error("Email ou senha incorretos")
      }
      setLoading(false)
    }, 600)
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
            Acesse sua conta
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="login-senha"
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    autoComplete="current-password"
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
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="mt-4 rounded-xl border border-border bg-muted p-3 text-center text-xs text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">Credenciais de teste</p>
          <p>
            Admin: <span className="font-mono">admin@zapmaxx.com.br</span> / <span className="font-mono">admin123</span>
          </p>
          <p>
            Lojista: <span className="font-mono">joao@pizzadaboa.com</span> / <span className="font-mono">loja123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
