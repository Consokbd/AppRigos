import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DashboardStats from '@/components/DashboardStats'
import RecentAgentsTable from '@/components/RecentAgentsTable'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const [total, active, inactive] = await Promise.all([
    prisma.agent.count(),
    prisma.agent.count({ where: { statut: 'ACTIF' } }),
    prisma.agent.count({ where: { statut: { not: 'ACTIF' } } }),
  ])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />

        <section className="space-y-6">
          <header className="card-surface p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Administration</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Tableau de bord</h1>
            <p className="mt-2 text-slate-600">Suivez les agents enregistres et les cartes de service generees.</p>
          </header>

          <DashboardStats total={total} active={active} inactive={inactive} cards={total} />

          <div className="card-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Derniers agents ajoutes</h2>
            </div>

            <RecentAgentsTable />
          </div>
        </section>
      </main>
    </div>
  )
}
