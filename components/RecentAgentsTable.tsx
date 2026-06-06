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

const SAMPLE: Agent[] = [
  { id: '1', nom: 'Jean', postnom: 'Kabongo', prenom: '', matricule: 'AGT-00123', service: "Systèmes d'Information", fonction: 'Informaticien', statut: 'ACTIF' },
  { id: '2', nom: 'Marie', postnom: 'Lukeni', prenom: '', matricule: 'AGT-00124', service: 'Ressources Humaines', fonction: 'Assistante RH', statut: 'ACTIF' },
  { id: '3', nom: 'Paul', postnom: 'Mbala', prenom: '', matricule: 'AGT-00125', service: 'Finances', fonction: 'Comptable', statut: 'ACTIF' },
  { id: '4', nom: 'Amina', postnom: 'Kanza', prenom: '', matricule: 'AGT-00126', service: 'Sécurité', fonction: 'Agent sécurité', statut: 'INACTIF' },
  { id: '5', nom: 'Luc', postnom: 'Mbuyi', prenom: '', matricule: 'AGT-00127', service: 'Logistique', fonction: 'Chauffeur', statut: 'ACTIF' },
]

export default function RecentAgentsTable() {
  const [agents, setAgents] = useState<Agent[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/agents')
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        if (mounted) setAgents(Array.isArray(data) ? data.slice(0, 5) : SAMPLE)
      } catch (e) {
        if (mounted) setAgents(SAMPLE)
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
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Nom</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Matricule</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Service</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Fonction</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Statut</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-700">Carte</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-200 animate-pulse">
                <td className="p-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                <td className="p-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="p-4"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                <td className="p-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                <td className="p-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="p-4"><div className="h-8 w-12 bg-gray-200 rounded" /></td>
              </tr>
            ))
          )}

          {!loading && agents && agents.map((agent) => (
            <tr key={agent.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-4 text-sm text-gray-700">{agent.nom} {agent.postnom ?? ''} {agent.prenom ?? ''}</td>
              <td className="p-4 text-sm text-gray-700">{agent.matricule}</td>
              <td className="p-4 text-sm text-gray-700">{agent.service}</td>
              <td className="p-4 text-sm text-gray-700">{agent.fonction}</td>
              <td className="p-4">
                {agent.statut === 'ACTIF' ? (
                  <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Actif</span>
                ) : (
                  <span className="inline-flex px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">Inactif</span>
                )}
              </td>
              <td className="p-4">
                <Link href={`/profile/${agent.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2">
                  <EyeIcon className="w-4 h-4" /> Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
