"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Store, AlertCircle, Eye, EyeOff } from "lucide-react"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function CadastroPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nome: "",
    nomeLoja: "",
    subdominio: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(field: string, value: string) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "nomeLoja") {
        updated.subdominio = generateSlug(value)
      }
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validations
    if (!formData.nome.trim()) {
      setError("Informe seu nome completo.")
      return
    }
    if (!formData.nomeLoja.trim()) {
      setError("Informe o nome do seu estabelecimento.")
      return
    }
    if (!formData.subdominio.trim()) {
      setError("O subdominio e obrigatorio.")
      return
    }
    if (formData.subdominio.length < 3) {
      setError("O subdominio deve ter pelo menos 3 caracteres.")
      return
    }
    if (!formData.email.trim()) {
      setError("Informe seu email.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Informe um email valido.")
      return
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas nao coincidem.")
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/login`,
        data: {
          role: "lojista",
          nome: formData.nome.trim(),
          nome_loja: formData.nomeLoja.trim(),
          subdominio: formData.subdominio.trim(),
        },
      },
    })

    if (signUpError) {
      setLoading(false)
      if (signUpError.message.includes("already registered")) {
        setError("Este email ja esta cadastrado. Tente fazer login.")
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
      return
    }

    router.push("/cadastro/sucesso")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Store className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">ZapMaxx</h1>
            <p className="text-sm text-muted-foreground">Catalogo Digital e Delivery</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Criar conta</CardTitle>
            <CardDescription>
              Cadastre seu estabelecimento na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nomeLoja">Nome do estabelecimento</Label>
                <Input
                  id="nomeLoja"
                  type="text"
                  placeholder="Ex: Pizzaria do Joao"
                  value={formData.nomeLoja}
                  onChange={(e) => handleChange("nomeLoja", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="subdominio">Subdominio</Label>
                <div className="flex items-center gap-0">
                  <Input
                    id="subdominio"
                    type="text"
                    placeholder="pizzaria-do-joao"
                    value={formData.subdominio}
                    onChange={(e) => handleChange("subdominio", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    disabled={loading}
                    className="rounded-r-none"
                  />
                  <span className="flex h-9 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    .zapmaxx.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Esse sera o endereco da sua loja online
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar minha conta"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-center text-sm">
            <p className="text-muted-foreground">
              Ja tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
