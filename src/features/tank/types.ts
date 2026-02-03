export type Tank = {
  id: string
  name: string
  size: number // liters
  filterType: string
  lightingHours: number // hours per day
  hasCO2: boolean
  createdAt: Date
}

export type CreateTankInput = Omit<Tank, 'id' | 'createdAt'>
