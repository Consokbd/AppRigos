import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CardActions from '@/components/CardActions'
import { redirect } from 'next/navigation'
import { createQRCode } from '@/lib/qrcode'

export const dynamic = 'force-dynamic'

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
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
          <h1 className="text-2xl font-semibold">Carte non trouvee</h1>
          <p className="mt-3">L'agent specifie n'existe pas.</p>
        </div>
      </div>
    )
  }

  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()
  const displayName = fullName.toUpperCase()
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
          <div className="card-surface mx-auto w-full max-w-6xl p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary">Carte de service</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">Carte de {fullName}</h1>
                <p className="mt-3 max-w-2xl text-slate-600">Apercu au format PVC, pret pour le telechargement PDF ou l'impression.</p>
              </div>
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                QR code pret
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div id="service-card" className="rigos-id-card">
              <div className="rigos-card-bg-top" />
              <div className="rigos-card-bg-right" />
              <div className="rigos-card-dot-field" />

              <div className="rigos-card-logo">
                <img src="/logo.jpeg" alt="RIGOS" />
              </div>

              <div className="rigos-card-photo">
                {agent.photo ? (
                  <img src={agent.photo} alt={fullName} />
                ) : (
                  <div>PHOTO</div>
                )}
              </div>

              <div className="rigos-card-details">
                <InfoLine label="Nom" value={displayName} />
                <InfoLine label="Fonction" value={agent.fonction.toUpperCase()} />
                <InfoLine label="Contractor" value="RIGOS" />
                <InfoLine label="Project" value={agent.service} />
              </div>

              <div className="rigos-card-qr">
                <img src={qrImage} alt="QR code du profil" />
              </div>

              <div className="rigos-card-footer">
                <div className="rigos-agent-icon" aria-hidden="true">
                  <span className="rigos-agent-head" />
                  <span className="rigos-agent-body" />
                </div>

                <div className="rigos-footer-copy">
                  <p className="rigos-footer-title">AGENT</p>
                  <div className="rigos-footer-rule" />
                  <p className="rigos-footer-matricule">
                    Matricule : <strong>{agent.matricule}</strong>
                  </p>
                  <p className="rigos-footer-validity">
                    RIGOS SARL - validite carte : <strong>{validUntil}</strong>
                  </p>
                </div>
              </div>
            </div>

            <CardActions agentId={agent.id} />
          </div>
        </section>
      </main>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span>{label} :</span>
      <strong>{value || '-'}</strong>
    </p>
  )
}
