'use client'

interface DashboardStatsProps {
  total: number
  active: number
  inactive: number
  cards: number
}

export default function DashboardStats({ total, active, inactive, cards }: DashboardStatsProps) {
  const items = [
    { title: 'Total agents', value: total, accent: 'accent-primary' },
    { title: 'Agents actifs', value: active, accent: 'accent-success' },
    { title: 'Agents inactifs', value: inactive, accent: 'accent-red' },
    { title: 'Cartes generees', value: cards, accent: 'accent-secondary' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <span className={`stat-badge ${item.accent}`}>{item.title}</span>
          <p className="mt-5 text-3xl font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
