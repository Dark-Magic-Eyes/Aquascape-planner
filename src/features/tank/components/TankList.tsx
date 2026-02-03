import { useTankStore } from '../store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TankList() {
  const tanks = useTankStore((state) => state.tanks)
  const removeTank = useTankStore((state) => state.removeTank)

  if (tanks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tanks yet. Create your first tank above!
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tanks.map((tank) => (
        <Card key={tank.id}>
          <CardHeader>
            <CardTitle>{tank.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Size:</span> {tank.size}L
            </div>
            <div className="text-sm">
              <span className="font-medium">Filter:</span> {tank.filterType}
            </div>
            <div className="text-sm">
              <span className="font-medium">Lighting:</span> {tank.lightingHours}h/day
            </div>
            <div className="text-sm">
              <span className="font-medium">CO₂:</span> {tank.hasCO2 ? 'Yes' : 'No'}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeTank(tank.id)}
              className="mt-4 w-full"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
