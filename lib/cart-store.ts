"use client"

import { create } from "zustand"
import type { CartItem, CartItemVariacao } from "@/lib/types"

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Customer info
  nomeCliente: string
  whatsappCliente: string
  formaEntrega: string
  mesa: number | null
  bairroEntrega: string
  freteValor: number
  formaPagamento: string
  trocoParaValor: string
  cupomCodigo: string
  cupomDesconto: number
  cupomTipo: string

  // Address
  enderecoCep: string
  enderecoRua: string
  enderecoNumero: string
  enderecoBairro: string
  enderecoComplemento: string
  enderecoReferencia: string

  // Actions
  addItem: (item: Omit<CartItem, "id" | "subtotal">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  setNomeCliente: (nome: string) => void
  setWhatsappCliente: (whatsapp: string) => void
  setFormaEntrega: (forma: string) => void
  setMesa: (mesa: number | null) => void
  setBairroEntrega: (bairro: string) => void
  setFreteValor: (valor: number) => void
  setFormaPagamento: (forma: string) => void
  setTrocoParaValor: (valor: string) => void
  setCupomCodigo: (codigo: string) => void
  setCupomDesconto: (desconto: number) => void
  setCupomTipo: (tipo: string) => void
  setEndereco: (field: string, value: string) => void

  // Computed
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

function calculateItemSubtotal(item: Omit<CartItem, "id" | "subtotal">) {
  let variacaoExtra = 0
  if (item.variacoes) {
    item.variacoes.forEach((v: CartItemVariacao) => {
      v.escolhas.forEach((e) => {
        variacaoExtra += e.valor || 0
      })
    })
  }
  return (item.valorUnitario + variacaoExtra) * item.quantidade
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  nomeCliente: "",
  whatsappCliente: "",
  formaEntrega: "",
  mesa: null,
  bairroEntrega: "",
  freteValor: 0,
  formaPagamento: "",
  trocoParaValor: "",
  cupomCodigo: "",
  cupomDesconto: 0,
  cupomTipo: "",

  enderecoCep: "",
  enderecoRua: "",
  enderecoNumero: "",
  enderecoBairro: "",
  enderecoComplemento: "",
  enderecoReferencia: "",

  addItem: (item) => {
    const id = `${item.produtoId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const subtotal = calculateItemSubtotal(item)
    set((state) => ({
      items: [...state.items, { ...item, id, subtotal }],
    }))
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, quantidade: quantity }
        updated.subtotal = calculateItemSubtotal(updated)
        return updated
      }),
    })),

  clearCart: () =>
    set({
      items: [],
      nomeCliente: "",
      whatsappCliente: "",
      formaEntrega: "",
      mesa: null,
      bairroEntrega: "",
      freteValor: 0,
      formaPagamento: "",
      trocoParaValor: "",
      cupomCodigo: "",
      cupomDesconto: 0,
      cupomTipo: "",
      enderecoCep: "",
      enderecoRua: "",
      enderecoNumero: "",
      enderecoBairro: "",
      enderecoComplemento: "",
      enderecoReferencia: "",
    }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  setNomeCliente: (nome) => set({ nomeCliente: nome }),
  setWhatsappCliente: (whatsapp) => set({ whatsappCliente: whatsapp }),
  setFormaEntrega: (forma) => set({ formaEntrega: forma }),
  setMesa: (mesa) => set({ mesa }),
  setBairroEntrega: (bairro) => set({ bairroEntrega: bairro }),
  setFreteValor: (valor) => set({ freteValor: valor }),
  setFormaPagamento: (forma) => set({ formaPagamento: forma }),
  setTrocoParaValor: (valor) => set({ trocoParaValor: valor }),
  setCupomCodigo: (codigo) => set({ cupomCodigo: codigo }),
  setCupomDesconto: (desconto) => set({ cupomDesconto: desconto }),
  setCupomTipo: (tipo) => set({ cupomTipo: tipo }),
  setEndereco: (field, value) => set({ [field]: value } as Partial<CartState>),

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
  getTotal: () => {
    const state = get()
    const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0)
    const frete = state.freteValor
    let desconto = 0
    if (state.cupomDesconto > 0) {
      if (state.cupomTipo === "1") {
        desconto = subtotal * (state.cupomDesconto / 100)
      } else {
        desconto = state.cupomDesconto
      }
    }
    return Math.max(0, subtotal + frete - desconto)
  },
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantidade, 0),
}))
