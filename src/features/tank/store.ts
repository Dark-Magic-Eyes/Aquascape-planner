import { create } from 'zustand'
import type { Tank, CreateTankInput } from './types'

type TankStore = {
  tanks: Tank[]
  addTank: (input: CreateTankInput) => void
  removeTank: (id: string) => void
  updateTank: (id: string, updates: Partial<CreateTankInput>) => void
  getTankById: (id: string) => Tank | undefined
}

export const useTankStore = create<TankStore>((set, get) => ({
  tanks: [],

  addTank: (input) => {
    const newTank: Tank = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    set((state) => ({ tanks: [...state.tanks, newTank] }))
  },

  removeTank: (id) => {
    set((state) => ({ tanks: state.tanks.filter((t) => t.id !== id) }))
  },

  updateTank: (id, updates) => {
    set((state) => ({
      tanks: state.tanks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },

  getTankById: (id) => {
    return get().tanks.find((t) => t.id === id)
  },
}))
