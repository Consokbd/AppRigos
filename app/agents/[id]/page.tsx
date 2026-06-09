import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AgentProfileActions from '@/components/AgentProfileActions'
import { createQRCode } from '@/lib/qrcode'

export const dynamic = 'force-dynamic'

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return (
      <div className="min-h-screen bg-surface px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-soft">
          <h1 className="text-2xl font-semibold">Agent non trouve</h1>
          <p className="mt-3">Verifiez l'identifiant ou retournez a la liste des agents.</p>
        </div>
      </div>
    )
  }

  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()
  const profileUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/profile/${agent.id}`
  const qrImage = agent.qrCode ?? (await createQRCode(profileUrl))
  const validityDate = new Date()
  validityDate.setFullYear(validityDate.getFullYear() + 1)
  const validUntil = validityDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />

        <section className="space-y-6">
          <div className="card-surface p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Fiche agent</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{fullName}</h1>
                <p className="mt-2 text-slate-600">{agent.fonction} - {agent.service}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/agents/${agent.id}/edit`} className="btn-primary">
                  Modifier
                </Link>
                <Link href={`/cards/${agent.id}`} className="btn-primary">
                  Voir la carte
                </Link>
                <Link href={`/profile/${agent.id}`} className="btn-outline">
                  Profil public
                </Link>
                <Link href="/agents" className="btn-outline">
                  Retour
                </Link>
              </div>
            </div>
          </div>

          <div id="agent-profile-card" className="card-surface p-6">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr_220px]">
              <div className="space-y-4">
                <div className="h-48 w-48 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  {agent.photo ? (
                    <img src={agent.photo} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">Photo</div>
                  )}
                </div>
                <span className={`status-pill ${agent.statut === 'ACTIF' ? 'status-active' : 'status-inactive'}`}>
                  {agent.statut}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Info label="Matricule" value={agent.matricule} />
                <Info label="Fonction" value={agent.fonction} />
                <Info label="Service" value={agent.service} />
                <Info label="Validite estimee" value={validUntil} />
                <Info label="Telephone" value={agent.telephone ?? 'Non renseigne'} />
                <Info label="Email" value={agent.email ?? 'Non renseigne'} />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Verification</p>
                <div className="mt-4 flex justify-center rounded-2xl bg-white p-4">
                  <img src={qrImage} alt="QR code du profil" className="h-36 w-36 object-contain" />
                </div>
                <p className="mt-4 text-center text-sm text-slate-600">Scannez pour ouvrir le profil public.</p>
              </div>
            </div>
          </div>

          <AgentProfileActions agentId={agent.id} />
        </section>
      </main>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  )
}
