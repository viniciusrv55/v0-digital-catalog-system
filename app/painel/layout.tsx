"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { mockLoja } from "@/lib/mock-data"
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Image, Truck, Ticket,
  Settings, CreditCard, BarChart3, LogOut, ExternalLink, Menu, X, ChevronRight
} from "lucide-react"

const navItems = [
  { href: "/painel", icon: LayoutDashboard, label: "Inicio" },
  { href: "/painel/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/painel/produtos", icon: Package, label: "Produtos" },
  { href: "/painel/categorias", icon: Tag, label: "Categorias" },
  { href: "/painel/banners", icon: Image, label: "Banners" },
  { href: "/painel/frete", icon: Truck, label: "Frete" },
  { href: "/painel/cupons", icon: Ticket, label: "Cupons" },
  { href: "/painel/configuracoes", icon: Settings, label: "Configuracoes" },
  { href: "/painel/plano", icon: CreditCard, label: "Plano" },
  { href: "/painel/relatorio", icon: BarChart3, label: "Relatorio" },
]

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const loja = mockLoja

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          {loja.perfil ? (
            <img
              src={loja.perfil}
              alt={loja.nome}
              className="h-10 w-10 rounded-xl object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: loja.cor }}
            >
              {loja.nome?.charAt(0)}
            </div>
          )}
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-semibold">{loja.nome}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{loja.subdominio}.zapmaxx.com.br</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {item.label}
                  {item.label === "Pedidos" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-bold text-sidebar-primary-foreground">
                      3
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Loja
          </a>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-card px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
            <span>Painel</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              {navItems.find((n) => n.href === pathname)?.label || "Inicio"}
            </span>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {/* Expiration warning */}
            {loja.expiracao && (
              <div className="hidden rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-800 md:block">
                Plano ativo ate {new Date(loja.expiracao).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
