'use client'

interface DashboardStatsProps {
  total: number
  active: number
  inactive: number
  cards: number
}

export default function DashboardStats({ total, active, inactive, cards }: DashboardStatsProps) {
  const items = [
    { title: 'Total Agents', value: total },
    { title: "Agents actifs", value: active },
    { title: "Agents inactifs", value: inactive },
    { title: "Cartes générées", value: cards },
  ]

  return (
    <div className="grid grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.title} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1" />
            </svg>
          </div>

          <p className="text-sm text-gray-500">{item.title}</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
