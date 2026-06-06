import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AgentProfileActions from '@/components/AgentProfileActions'

export const dynamic = 'force-dynamic'

export default async function AgentDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession()
  if (!session) redirect('/login')

  const { id } = params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-soft">
          <h1 className="text-2xl font-semibold">Agent non trouvé</h1>
          <p className="mt-3">Vérifiez l'identifiant ou retournez à la liste des agents.</p>
        </div>
      </div>
    )
  }

  // compute expiry date (fallback if not present)
  const validityDate = new Date()
  validityDate.setFullYear(validityDate.getFullYear() + 1)
  const validUntil = validityDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim().toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />

        <section className="ml-0 lg:ml-0">
          <div className="ml-64 p-8">
            <div className="card-container max-w-md mx-auto bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200/20 flex items-center justify-center">
                  <span className="text-xl font-semibold">Photo</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm uppercase tracking-widest text-gray-300">RIGOS</p>
                  <h2 className="agent-name">{fullName}</h2>
                  <p className="agent-function">{agent.fonction ?? 'Fonction'}</p>
                  <p className="text-sm text-gray-300">Contractor: RIGOS</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-300">Project:</p>
                <p className="text-white/80">&nbsp;</p>
              </div>

              <div className="agent-number text-center text-yellow-400">8</div>

              <div className="mt-2 text-center">
                <p className="text-sm text-gray-300">Matricule</p>
                <p className="text-white font-semibold">{agent.matricule ?? 'RIG - 0000'}</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                <p className="text-sm text-gray-300">RIGOS SARL - validité carte : {agent.cardExpiry ?? validUntil}</p>
              </div>
            </div>

            <AgentProfileActions agentId={agent.id} />
          </div>
        </section>
      </main>
    </div>
  )
}
