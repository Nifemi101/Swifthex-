import { useRef, useEffect, useState } from 'react'
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

const tabs: { name: TabName; label: string; icon: typeof Home01Icon }[] = [
  { name: 'portfolio', label: 'Portfolio', icon: Home01Icon },
  { name: 'rates',     label: 'Rates',     icon: ChartLineData02Icon },
  { name: 'swap',      label: 'Swap',      icon: Exchange01Icon },
  { name: 'history',   label: 'History',   icon: Clock01Icon },
  { name: 'profile',   label: 'Profile',   icon: UserCircleIcon },
]

const ACTIVE_COLOR   = '#8B5CF6'
const INACTIVE_COLOR = 'rgba(255,255,255,0.85)'

// Width and height of the oval pill 
const OVAL_W = 48
const OVAL_H = 33

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const activeIndex  = tabs.findIndex(t => t.name === activeTab)
  const buttonRefs   = useRef<(HTMLButtonElement | null)[]>([])
  const [pillLeft, setPillLeft] = useState<number | null>(null)
  const [pillTop,  setPillTop]  = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const btn       = buttonRefs.current[activeIndex]
    const container = containerRef.current
    if (!btn || !container) return

    const btnRect  = btn.getBoundingClientRect()
    const conRect  = container.getBoundingClientRect()

    const iconCenterX = btnRect.left - conRect.left + btnRect.width  / 2
    const iconCenterY = btnRect.top  - conRect.top  + btnRect.height * 0.35

    setPillLeft(iconCenterX - OVAL_W / 2)
    setPillTop(iconCenterY  - OVAL_H / 2)
  }, [activeIndex])

  return (
    <nav
      className="fixed left-0 right-0 z-50 flex justify-center"
      style={{ bottom: '16px', paddingLeft: '16px', paddingRight: '16px' }}
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-between"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '72px',
          paddingLeft: '8px',
          paddingRight: '8px',
          background: '#1F1F1F',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 10px 35px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        {pillLeft !== null && (
          <div
            style={{
              position: 'absolute',
              top:    pillTop  ?? 0,
              left:   pillLeft ?? 0,
              width:  OVAL_W,
              height: OVAL_H,
              borderRadius: '9999px',
              backgroundColor: 'rgba(139, 92, 246, 0.22)',
              transition: 'left 300ms cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.name

          return (
            <button
              key={tab.name}
              ref={el => { buttonRefs.current[i] = el }}
              onClick={() => onTabChange(tab.name)}
              className="relative z-10 flex flex-col items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                gap: '4px',
              }}
            >
              <HugeiconsIcon
                icon={tab.icon}
                size={22}
                color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                  transition: 'color 0.25s ease',
                  lineHeight: 1,
                }}
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