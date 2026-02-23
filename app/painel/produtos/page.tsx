"use client"

import { useState } from "react"
import { mockProdutos, mockCategorias } from "@/lib/mock-data"
import type { Produto } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Package, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("todos")
  const [editando, setEditando] = useState<Produto | null>(null)
  const [isNew, setIsNew] = useState(false)

  const categorias = mockCategorias

  const filtrados = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === "todos" || p.relCategoriasId === catFilter
    return matchSearch && matchCat
  })

  function openNew() {
    setIsNew(true)
    setEditando({
      id: Date.now(),
      relEstabelecimentosId: "1",
      relCategoriasId: "1",
      nome: "",
      descricao: "",
      valor: 0,
      oferta: "2",
      visible: "1",
      status: "1",
      statusp: "1",
      estoque: "1",
      posicao: String(produtos.length),
    })
  }

  function salvar() {
    if (!editando) return
    if (!editando.nome.trim()) {
      toast.error("Nome do produto e obrigatorio")
      return
    }

    if (isNew) {
      setProdutos((prev) => [...prev, editando])
      toast.success("Produto criado com sucesso")
    } else {
      setProdutos((prev) =>
        prev.map((p) => (p.id === editando.id ? editando : p))
      )
      toast.success("Produto atualizado com sucesso")
    }
    setEditando(null)
    setIsNew(false)
  }

  function excluir(id: number) {
    setProdutos((prev) => prev.filter((p) => p.id !== id))
    toast.success("Produto removido")
  }

  function toggleStatus(id: number) {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "1" ? "2" : "1" } : p
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">{produtos.length} produtos cadastrados</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas categorias</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products list */}
      <div className="flex flex-col gap-3">
        {filtrados.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filtrados.map((produto) => (
            <Card key={produto.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {produto.destaque ? (
                    <img
                      src={produto.destaque}
                      alt={produto.nome}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{produto.nome}</p>
                      {produto.oferta === "1" && (
                        <Badge variant="secondary" className="border-0 bg-red-100 text-xs text-red-700">
                          Oferta
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {categorias.find((c) => String(c.id) === produto.relCategoriasId)?.nome || "Sem categoria"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {produto.oferta === "1" && produto.valorPromocional ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            R$ {produto.valor.toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            R$ {produto.valorPromocional.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-foreground">
                          R$ {produto.valor.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={produto.status === "1"}
                      onCheckedChange={() => toggleStatus(produto.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsNew(false)
                        setEditando({ ...produto })
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => excluir(produto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      <Dialog open={!!editando} onOpenChange={() => { setEditando(null); setIsNew(false) }}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {editando && (
            <>
              <DialogHeader>
                <DialogTitle>{isNew ? "Novo Produto" : "Editar Produto"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="prod-nome">Nome</Label>
                  <Input
                    id="prod-nome"
                    value={editando.nome}
                    onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                    placeholder="Nome do produto"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="prod-desc">Descricao</Label>
                  <Textarea
                    id="prod-desc"
                    value={editando.descricao || ""}
                    onChange={(e) => setEditando({ ...editando, descricao: e.target.value })}
                    placeholder="Descricao do produto"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prod-valor">Preco (R$)</Label>
                    <Input
                      id="prod-valor"
                      type="number"
                      step="0.01"
                      value={editando.valor}
                      onChange={(e) => setEditando({ ...editando, valor: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prod-cat">Categoria</Label>
                    <Select
                      value={editando.relCategoriasId}
                      onValueChange={(val) => setEditando({ ...editando, relCategoriasId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Em oferta</p>
                    <p className="text-xs text-muted-foreground">Exibir preco promocional</p>
                  </div>
                  <Switch
                    checked={editando.oferta === "1"}
                    onCheckedChange={(val) =>
                      setEditando({ ...editando, oferta: val ? "1" : "2" })
                    }
                  />
                </div>
                {editando.oferta === "1" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prod-promo">Preco Promocional (R$)</Label>
                    <Input
                      id="prod-promo"
                      type="number"
                      step="0.01"
                      value={editando.valorPromocional || ""}
                      onChange={(e) =>
                        setEditando({ ...editando, valorPromocional: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setEditando(null); setIsNew(false) }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={salvar}>
                    {isNew ? "Criar Produto" : "Salvar"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
