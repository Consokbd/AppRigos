'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EyeIcon } from '@/components/Icons'

interface Agent {
  id: string
  nom: string
  postnom?: string | null
  prenom?: string | null
  matricule: string
  service: string
  fonction: string
  statut: string
}

export default function RecentAgentsTable() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await fetch('/api/agents')
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        if (mounted) setAgents(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch {
        if (mounted) setFailed(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">ID No</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Service</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Function</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Statut</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Carte</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4"><div className="h-4 w-32 rounded bg-slate-200" /></td>
                  <td className="p-4"><div className="h-4 w-20 rounded bg-slate-200" /></td>
                  <td className="p-4"><div className="h-4 w-40 rounded bg-slate-200" /></td>
                  <td className="p-4"><div className="h-4 w-32 rounded bg-slate-200" /></td>
                  <td className="p-4"><div className="h-4 w-16 rounded bg-slate-200" /></td>
                  <td className="p-4"><div className="h-8 w-12 rounded bg-slate-200" /></td>
                </tr>
              ))
            )}

            {!loading && failed && (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-red-700">Impossible de charger les derniers agents.</td>
              </tr>
            )}

            {!loading && !failed && agents.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-slate-600">Aucun agent enregistre pour le moment.</td>
              </tr>
            )}

            {!loading && !failed && agents.map((agent) => {
              const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()

              return (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-700">{fullName}</td>
                  <td className="p-4 text-sm text-slate-700">{agent.matricule}</td>
                  <td className="p-4 text-sm text-slate-700">{agent.service}</td>
                  <td className="p-4 text-sm text-slate-700">{agent.fonction}</td>
                  <td className="p-4">
                    <span className={`status-pill ${agent.statut === 'ACTIF' ? 'status-active' : 'status-inactive'}`}>
                      {agent.statut}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/cards/${agent.id}`} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                      <EyeIcon className="h-4 w-4" /> Voir
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
