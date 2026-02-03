import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold hover:opacity-80">
              Aquascape Planner
            </Link>
            <div className="flex gap-4">
              <Link
                to="/tanks"
                className="text-sm font-medium hover:underline"
                activeProps={{ className: 'underline' }}
              >
                Tanks
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  ),
})
