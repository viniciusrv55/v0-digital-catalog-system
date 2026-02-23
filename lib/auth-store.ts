"use client"

import { create } from "zustand"

export type UserRole = "admin" | "estabelecimento"

export interface AuthUser {
  id: number
  nome: string
  email: string
  role: UserRole
  estabelecimentoId?: number
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isLoading: false }),
}))
