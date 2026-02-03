import { useState } from 'react'
import { useTankStore } from '../store'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

export function TankForm() {
  const addTank = useTankStore((state) => state.addTank)

  const [formData, setFormData] = useState({
    name: '',
    size: 0,
    filterType: '',
    lightingHours: 8,
    hasCO2: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTank(formData)
    // Reset form
    setFormData({
      name: '',
      size: 0,
      filterType: '',
      lightingHours: 8,
      hasCO2: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Tank</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tank Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Main Display Tank"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Size (liters)</label>
            <Input
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
              placeholder="e.g. 60"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Filter Type</label>
            <Input
              value={formData.filterType}
              onChange={(e) => setFormData({ ...formData, filterType: e.target.value })}
              placeholder="e.g. Canister, HOB, Sponge"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Lighting Hours/Day</label>
            <Input
              type="number"
              value={formData.lightingHours}
              onChange={(e) => setFormData({ ...formData, lightingHours: Number(e.target.value) })}
              min="0"
              max="24"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasCO2"
              checked={formData.hasCO2}
              onChange={(e) => setFormData({ ...formData, hasCO2: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="hasCO2" className="text-sm font-medium">
              Has CO₂ injection
            </label>
          </div>

          <Button type="submit" className="w-full">
            Add Tank
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
