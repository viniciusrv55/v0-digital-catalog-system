import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, MailCheck } from "lucide-react"

export default function CadastroSucessoPage() {
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Conta criada com sucesso!</CardTitle>
            <CardDescription className="text-balance">
              Enviamos um email de confirmacao para o endereco cadastrado. 
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Nao recebeu o email? Verifique a pasta de spam ou lixo eletronico. 
                O email pode levar alguns minutos para chegar.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">Ir para o login</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Voltar ao inicio</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
