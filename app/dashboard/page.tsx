import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import DashboardStats from '@/components/DashboardStats'
import RecentAgentsTable from '@/components/RecentAgentsTable'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerAuthSession()
  if (!session) return null

  const [total, active, inactive] = await Promise.all([
    prisma.agent.count(),
    prisma.agent.count({ where: { statut: 'ACTIF' } }),
    prisma.agent.count({ where: { statut: { not: 'ACTIF' } } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Bonjour, Administrateur 🎉</p>
        </header>

        <section className="mb-8">
          <DashboardStats total={total} active={active} inactive={inactive} cards={total} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📋 Derniers agents ajoutés</h2>
          </div>

          <RecentAgentsTable />
        </section>
      </div>
    </div>
  )
}
