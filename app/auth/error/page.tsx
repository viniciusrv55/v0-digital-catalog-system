import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Erro de autenticacao</CardTitle>
            <CardDescription className="text-balance">
              Ocorreu um erro durante o processo de autenticacao. 
              Isso pode acontecer se o link de confirmacao expirou ou ja foi utilizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Se o problema persistir, tente criar uma nova conta ou entre em contato com o suporte.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">Tentar fazer login</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/cadastro">Criar nova conta</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
