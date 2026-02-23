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
import {
  Search,
  Users,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  Store,
  Calendar,
  Mail,
  Phone,
} from "lucide-react"
import { toast } from "sonner"
import { mockUsuarios } from "@/lib/mock-data"
import type { Usuario } from "@/lib/types"

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Usuario | null>(null)
  const [filtroRole, setFiltroRole] = useState<"all" | "admin" | "owner">("all")

  const filtrados = usuarios.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.cpfCnpj || "").includes(search) ||
      (u.estabelecimentoNome || "").toLowerCase().includes(search.toLowerCase())
    const matchRole = filtroRole === "all" || u.role === filtroRole
    return matchSearch && matchRole
  })

  function toggleStatus(id: number) {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "1" ? "2" : "1" } : u
      )
    )
    toast.success("Status atualizado")
  }

  const totalAdmin = usuarios.filter((u) => u.role === "admin").length
  const totalOwner = usuarios.filter((u) => u.role === "owner").length
  const totalAtivos = usuarios.filter((u) => u.status === "1").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          {usuarios.length} usuarios cadastrados
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">
                {usuarios.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Admins</p>
              <p className="text-lg font-bold text-foreground">{totalAdmin}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Lojistas Ativos
              </p>
              <p className="text-lg font-bold text-foreground">
                {totalAtivos}/{totalOwner}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, CPF/CNPJ ou loja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "owner"] as const).map((role) => (
            <Button
              key={role}
              variant={filtroRole === role ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroRole(role)}
            >
              {role === "all"
                ? "Todos"
                : role === "admin"
                  ? "Admins"
                  : "Lojistas"}
            </Button>
          ))}
        </div>
      </div>

      {/* User list */}
      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhum usuario encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((usuario) => (
            <Card key={usuario.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        usuario.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {usuario.nome}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`border-0 text-[10px] ${
                            usuario.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {usuario.role === "admin" ? "Admin" : "Lojista"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {usuario.email}
                        {usuario.estabelecimentoNome &&
                          ` - ${usuario.estabelecimentoNome}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`border-0 text-xs ${
                        usuario.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.status === "1" ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(usuario)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(usuario.id)}
                      className={
                        usuario.status === "1"
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {usuario.status === "1" ? (
                        <Ban className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.nome}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`border-0 text-xs ${
                      selected.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {selected.role === "admin" ? "Administrador" : "Lojista"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`border-0 text-xs ${
                      selected.status === "1"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selected.status === "1" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-foreground">{selected.email}</span>
                  </div>
                  {selected.cpfCnpj && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                      <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-foreground">
                        {selected.cpfCnpj}
                      </span>
                    </div>
                  )}
                  {selected.estabelecimentoNome && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                      <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-foreground">
                        {selected.estabelecimentoNome}
                      </span>
                    </div>
                  )}
                  {selected.trialEndsAt && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                      <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Trial ate
                        </p>
                        <p className="text-foreground">
                          {new Date(selected.trialEndsAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Criado em
                      </p>
                      <p className="text-foreground">
                        {new Date(selected.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
