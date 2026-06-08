import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DashboardStats from '@/components/DashboardStats'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const [total, active, inactive, withQrCode] = await Promise.all([
    prisma.agent.count(),
    prisma.agent.count({ where: { statut: 'ACTIF' } }),
    prisma.agent.count({ where: { statut: { not: 'ACTIF' } } }),
    prisma.agent.count({ where: { qrCode: { not: null } } }),
  ])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Rapports</h1>
            <p className="mt-2 text-slate-600">Vue rapide de l'etat des agents et des cartes disponibles.</p>
          </div>

          <DashboardStats total={total} active={active} inactive={inactive} cards={withQrCode} />
        </section>
      </main>
    </div>
  )
}
