'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  UsersIcon,
  UserPlusIcon,
  PrinterIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@/components/Icons'

export default function Sidebar() {
  const pathname = usePathname() || '/dashboard'

  const navItems = [
    { href: '/dashboard', label: 'Agents', icon: UsersIcon },
    { href: '/agents/new', label: 'Nouveau agent', icon: UserPlusIcon },
    { href: '/cards', label: "Impression des cartes", icon: PrinterIcon },
    { href: '/reports', label: 'Rapports', icon: DocumentChartBarIcon },
    { href: '/settings', label: 'Paramètres', icon: Cog6ToothIcon },
    { href: '/users', label: 'Utilisateurs', icon: UserGroupIcon },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg fixed inset-y-0 left-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <div>
          <p className="text-2xl font-bold text-blue-600">RIGOS</p>
        </div>
      </div>

      <nav className="mt-6 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${
                active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
