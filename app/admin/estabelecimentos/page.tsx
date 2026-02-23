"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Store, Eye, Ban, CheckCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface AdminEstab {
  id: number
  nome: string
  subdominio: string
  plano: string
  status: string
  cidade: string
  email: string
  whatsapp: string
  pedidos: number
  produtos: number
  expiracao: string
}

const mockEstabs: AdminEstab[] = [
  { id: 1, nome: "Pizza da Boa", subdominio: "pizzadaboa", plano: "Essencial", status: "1", cidade: "Sao Paulo", email: "pizzadaboa@email.com", whatsapp: "(11)99999-9999", pedidos: 156, produtos: 12, expiracao: "2026-12-31" },
  { id: 2, nome: "Acai Power", subdominio: "acaipower", plano: "Profissional", status: "1", cidade: "Rio de Janeiro", email: "acai@power.com", whatsapp: "(21)98888-7777", pedidos: 89, produtos: 24, expiracao: "2027-03-15" },
  { id: 3, nome: "Burger King Lab", subdominio: "burgerkinglab", plano: "Gratis", status: "1", cidade: "Belo Horizonte", email: "bklab@email.com", whatsapp: "(31)97777-6666", pedidos: 23, produtos: 8, expiracao: "2026-06-01" },
  { id: 4, nome: "Sushi Tokyo", subdominio: "sushitokyo", plano: "Essencial", status: "2", cidade: "Curitiba", email: "sushi@tokyo.com", whatsapp: "(41)96666-5555", pedidos: 45, produtos: 30, expiracao: "2026-02-01" },
  { id: 5, nome: "Cafe Aroma", subdominio: "cafearoma", plano: "Profissional", status: "1", cidade: "Salvador", email: "cafe@aroma.com", whatsapp: "(71)95555-4444", pedidos: 211, produtos: 18, expiracao: "2027-01-20" },
]

export default function EstabelecimentosAdminPage() {
  const [estabs, setEstabs] = useState(mockEstabs)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<AdminEstab | null>(null)

  const filtrados = estabs.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase()) ||
    e.subdominio.toLowerCase().includes(search.toLowerCase()) ||
    e.cidade.toLowerCase().includes(search.toLowerCase())
  )

  function toggleStatus(id: number) {
    setEstabs((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === "1" ? "2" : "1" } : e
      )
    )
    toast.success("Status atualizado")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estabelecimentos</h1>
        <p className="text-sm text-muted-foreground">{estabs.length} estabelecimentos cadastrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, subdominio ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Store className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum estabelecimento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((estab) => (
            <Card key={estab.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {estab.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{estab.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {estab.subdominio}.zapmaxx.com.br - {estab.cidade}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{estab.plano}</Badge>
                    <Badge
                      variant="secondary"
                      className={`border-0 text-xs ${
                        estab.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {estab.status === "1" ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(estab)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(estab.id)}
                      className={estab.status === "1" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                    >
                      {estab.status === "1" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.nome}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Pedidos</p>
                    <p className="text-lg font-bold text-foreground">{selected.pedidos}</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Produtos</p>
                    <p className="text-lg font-bold text-foreground">{selected.produtos}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subdominio</span>
                    <span className="font-medium text-foreground">{selected.subdominio}.zapmaxx.com.br</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano</span>
                    <Badge variant="outline" className="text-xs">{selected.plano}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground">{selected.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp</span>
                    <span className="text-foreground">{selected.whatsapp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiracao</span>
                    <span className="text-foreground">{new Date(selected.expiracao).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={`https://${selected.subdominio}.zapmaxx.com.br`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visitar Loja
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
