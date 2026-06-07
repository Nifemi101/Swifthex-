
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  ChartLineData02Icon,
  Exchange01Icon,
  Clock01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons'
import type { TabName } from '../../types'

interface NavbarProps {
  activeTab: TabName
  onTabChange: (tab: TabName) => void
}

// Tab configuration — icon, label, and tab name
const tabs: { name: TabName; label: string; icon: typeof Home01Icon }[] = [
  { name: 'portfolio', label: 'Portfolio', icon: Home01Icon },
  { name: 'rates',     label: 'Rates',     icon: ChartLineData02Icon },
  { name: 'swap',      label: 'Swap',      icon: Exchange01Icon },
  { name: 'history',   label: 'History',   icon: Clock01Icon },
  { name: 'profile',   label: 'Profile',   icon: UserCircleIcon },
]

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-6 pt-2"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name

          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200"
              style={{
                backgroundColor: isActive ? '#1E1B2E' : 'transparent',
                minWidth: '60px',
              }}
            >
              {/* Icon */}
              <HugeiconsIcon
                icon={tab.icon}
                size={22}
                color={isActive ? '#8B5CF6' : '#6B7280'}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {/* Label */}
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? '#8B5CF6' : '#6B7280' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar