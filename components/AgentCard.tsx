import Link from 'next/link'

interface AgentCardProps {
  agent: {
    id: string
    matricule: string
    nom: string
    postnom?: string | null
    prenom?: string | null
    fonction: string
    service: string
    statut: string
  }
  deleteAction: (formData: FormData) => Promise<void>
}

export default function AgentCard({ agent, deleteAction }: AgentCardProps) {
  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()

  return (
    <article className="agent-card">
      <div className="agent-card-inner">
        <div className="agent-card-meta">
          <div className="agent-card-service">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            <span>{agent.service}</span>
          </div>
          <div>
            <h3 className="agent-card-name">{fullName}</h3>
            <p className="agent-card-fonction">{agent.fonction}</p>
          </div>
          <p className="agent-card-matricule">
            ID No: <span className="font-semibold text-slate-900">{agent.matricule}</span>
          </p>
        </div>

        <div className="agent-card-actions">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${agent.statut === 'ACTIF' ? 'bg-success/10 text-success' : 'bg-red-100 text-red-700'}`}>
            {agent.statut}
          </span>
          <Link href={`/agents/${agent.id}`} className="btn-primary">
            Profil
          </Link>
          <Link href={`/cards/${agent.id}`} className="btn-outline">
            Carte
          </Link>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={agent.id} />
            <button
              type="submit"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Supprimer
            </button>
          </form>
        </div>
      </div>
    </article>
  )
}
