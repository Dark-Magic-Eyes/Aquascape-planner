import { createFileRoute } from '@tanstack/react-router'
import { TankForm, TankList } from '../features/tank'

export const Route = createFileRoute('/tanks')({
  component: TanksPage,
})

function TanksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Tanks</h2>
        <p className="text-muted-foreground">
          Manage your aquariums and their configurations
        </p>
      </div>

      <TankForm />
      <TankList />
    </div>
  )
}
