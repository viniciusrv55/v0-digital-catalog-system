"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Ban, CheckCircle, Shield } from "lucide-react"
import { toast } from "sonner"

interface AdminUser {
  id: number
  nome: string
  email: string
  role: "admin" | "lojista"
  status: "1" | "2"
  estabelecimento: string | null
  criadoEm: string
}

const mockUsers: AdminUser[] = [
  { id: 1, nome: "Admin ZapMaxx", email: "admin@zapmaxx.com", role: "admin", status: "1", estabelecimento: null, criadoEm: "2025-01-01" },
  { id: 2, nome: "Joao da Pizza", email: "joao@pizzadaboa.com", role: "lojista", status: "1", estabelecimento: "Pizza da Boa", criadoEm: "2025-03-15" },
  { id: 3, nome: "Maria do Acai", email: "maria@acaipower.com", role: "lojista", status: "1", estabelecimento: "Acai Power", criadoEm: "2025-04-20" },
  { id: 4, nome: "Carlos Burger", email: "carlos@bklab.com", role: "lojista", status: "2", estabelecimento: "Burger King Lab", criadoEm: "2025-05-10" },
  { id: 5, nome: "Ana Sushi", email: "ana@sushitokyo.com", role: "lojista", status: "1", estabelecimento: "Sushi Tokyo", criadoEm: "2025-06-01" },
  { id: 6, nome: "Paulo Cafe", email: "paulo@cafearoma.com", role: "lojista", status: "1", estabelecimento: "Cafe Aroma", criadoEm: "2025-07-12" },
]

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState("")

  const filtrados = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.estabelecimento && u.estabelecimento.toLowerCase().includes(search.toLowerCase()))
  )

  function toggleStatus(id: number) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "1" ? "2" : "1" } : u
      )
    )
    toast.success("Status atualizado")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuarios cadastrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou estabelecimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum usuario encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{user.nome}</p>
                        {user.role === "admin" && (
                          <Badge variant="secondary" className="border-0 bg-primary/10 text-primary text-xs gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {user.estabelecimento && (
                        <p className="text-xs text-muted-foreground">
                          Estabelecimento: {user.estabelecimento}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.criadoEm).toLocaleDateString("pt-BR")}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`border-0 text-xs ${
                        user.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "1" ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(user.id)}
                      className={user.status === "1" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                    >
                      {user.status === "1" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
