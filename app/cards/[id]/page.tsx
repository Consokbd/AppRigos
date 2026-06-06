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
          <h1 className="text-2xl font-semibold">Carte non trouvée</h1>
          <p className="mt-3">L'agent spécifié n'existe pas.</p>
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
        <section className="space-y-6 lg:mx-auto">
          <div className="card-surface mx-auto w-full max-w-5xl p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary">Carte de service</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">Fiche agent</h1>
                <p className="mt-3 max-w-2xl text-slate-600">Imprimez une carte de service professionnelle avec le style RIGOS et un QR Code fonctionnel.</p>
              </div>
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                QR Code prêt
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div id="service-card" className="service-card">
              <div className="service-card-inner">
                <div className="card-top">
                  <div className="card-brand">
                    <img src="/logo.jpeg" alt="RIGOS" className="card-logo" />
                    <div className="card-brand-title">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Carte de service</p>
                      <p className="text-xl font-semibold text-slate-900">RIGOS SARL</p>
                    </div>
                  </div>

                  <div className="card-qr-panel">
                    <div className="card-qr">
                      <img src={qrImage} alt="QR code du profil" className="h-36 w-36 object-contain" />
                    </div>
                    <p className="text-center text-xs uppercase tracking-[0.35em] text-slate-500">Scannez pour afficher le profil</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="card-photo">
                        {agent.photo ? (
                          <img src={agent.photo} alt={fullName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="card-photo-placeholder">R</div>
                        )}
                      </div>
                      <div className="card-detail-group">
                        <div>
                          <p className="card-label">Nom</p>
                          <p className="card-value">{fullName}</p>
                        </div>
                        <div>
                          <p className="card-label">Fonction</p>
                          <p className="card-value">{agent.fonction}</p>
                        </div>
                        <div>
                          <p className="card-label">Contrat</p>
                          <p className="card-value small">RIGOS SARL</p>
                        </div>
                        <div>
                          <p className="card-label">Projet</p>
                          <p className="card-value small">{agent.service || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-slate-50 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-2xl font-semibold text-white">AG</div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Matricule</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{agent.matricule}</p>
                      </div>
                    </div>
                    <hr className="card-divider" />
                    <div className="card-detail-group">
                      <div>
                        <p className="card-label">Statut</p>
                        <p className="card-value small">{agent.statut}</p>
                      </div>
                      <div>
                        <p className="card-label">Validité</p>
                        <p className="card-value small">{validUntil}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer-banner">
                  <div className="card-footer-block">
                    <p className="card-footer-label">Agent</p>
                    <p className="card-footer-text">{fullName}</p>
                  </div>
                  <div className="card-footer-block">
                    <p className="card-footer-label">Détails</p>
                    <p className="card-footer-text">RIGOS SARL - validité carte : {validUntil}</p>
                  </div>
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
