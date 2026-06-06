import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DashboardStats from '@/components/DashboardStats'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerAuthSession()
  if (!session) {
    return null
  }

  const [total, active, inactive, recentAgents] = await Promise.all([
    prisma.agent.count(),
    prisma.agent.count({ where: { statut: 'ACTIF' } }),
    prisma.agent.count({ where: { statut: { not: 'ACTIF' } } }),
    prisma.agent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft overflow-hidden">
            <div className="dashboard-hero">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Aperçu du tableau de bord</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">Bonjour, Administrateur</h1>
                <p className="mt-3 max-w-2xl text-slate-600">Suivez les agents, les cartes émises et les dernières activités depuis un seul espace.</p>
              </div>
              <div className="dashboard-hero-card">
                <p className="dashboard-hero-card-title">État du système</p>
                <p className="dashboard-hero-card-value">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          <DashboardStats total={total} active={active} inactive={inactive} cards={total} />

          <div className="card-surface p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Derniers agents</h2>
                <p className="mt-1 text-sm text-slate-500">Les cinq dernières fiches ajoutées.</p>
              </div>
              <Link href="/agents" className="rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary">
                Voir tous les agents
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {recentAgents.length === 0 ? (
                <p className="text-sm text-slate-600">Aucun agent enregistré pour le moment.</p>
              ) : (
                recentAgents.map((agent) => (
                  <div key={agent.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{agent.nom} {agent.postnom ?? ''} {agent.prenom ?? ''}</p>
                        <p className="text-sm text-slate-500">{agent.fonction} • {agent.service}</p>
                      </div>
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{agent.statut}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
