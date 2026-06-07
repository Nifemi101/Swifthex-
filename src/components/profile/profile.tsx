// ============================================================
// SwiftyEx TWA — Profile Page
// Shows user info, KYC status, referral code and support
// ============================================================

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  Copy01Icon,
  Tick01Icon,
  UserCircleIcon,
  SecurityValidationIcon,
  CustomerSupportIcon,
  GiftCard02Icon,
  ArrowRight01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import useUser from '../../hooks/useUser'
import { ProfileSkeleton } from '../UI/skeleton'
import { useSupportChat } from '../../hooks/useGroqAi'

// ============================================================
// Support Chat Window
// ============================================================
const SupportChat = ({ onClose }: { onClose: () => void }) => {
  const { messages, loading, sendMessage } = useSupportChat()
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid #1A1A24' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <HugeiconsIcon icon={CustomerSupportIcon} size={18} color="#FFFFFF" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">SwiftyEx Support</p>
            <p className="text-xs" style={{ color: '#16A34A' }}>AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-sm font-medium"
          style={{ color: '#8B5CF6' }}
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
              style={{
                backgroundColor: msg.role === 'user' ? '#8B5CF6' : '#141418',
                color: '#FFFFFF',
                borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                borderBottomLeftRadius: msg.role === 'assistant' ? 4 : undefined,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl flex gap-1"
              style={{ backgroundColor: '#141418' }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: '#6B7280',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex gap-2"
        style={{ borderTop: '1px solid #1A1A24' }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about SwiftyEx..."
          className="flex-1 rounded-2xl px-4 py-3 text-sm text-white outline-none"
          style={{ backgroundColor: '#141418', caretColor: '#8B5CF6' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{
            backgroundColor: input.trim() ? '#8B5CF6' : '#141418',
          }}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#FFFFFF" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

// ============================================================
// Profile Menu Item — reusable row
// ============================================================
const MenuItem = ({
  icon: Icon,
  label,
  value,
  color = '#8B5CF6',
  onClick,
}: {
  icon: IconSvgElement
  label: string
  value?: string
  color?: string
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl mb-2 transition-all active:scale-95"
    style={{ backgroundColor: '#141418' }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <HugeiconsIcon icon={Icon} size={18} color={color} strokeWidth={1.5} />
      </div>
      <span className="text-white text-sm font-medium">{label}</span>
    </div>

    {value ? (
      <span className="text-xs" style={{ color: '#6B7280' }}>{value}</span>
    ) : (
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#6B7280" strokeWidth={1.5} />
    )}
  </button>
)

// ============================================================
// Profile Page
// ============================================================
const Profile = () => {
  const { user, loading } = useUser()
  const [copied, setCopied]         = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  // ── Copy referral code to clipboard ─────────────────────
  const copyReferral = () => {
    if (!user?.referral_code) return
    navigator.clipboard.writeText(user.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Get initials for avatar ──────────────────────────────
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col px-4 pt-6 pb-4">

        {/* ── User Card ──────────────────────────────────── */}
        <div
          className="w-full rounded-2xl p-5 mb-4"
          style={{ backgroundColor: '#141418' }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar with initials */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              {user?.first_name ? getInitials(user.first_name) : (
                <HugeiconsIcon icon={UserCircleIcon} size={32} color="#FFFFFF" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              {/* Name */}
              <h2 className="text-white font-bold text-lg leading-tight">
                {user?.first_name || 'Swiftronaut'}
              </h2>

              {/* Username */}
              {user?.username && (
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  @{user.username}
                </p>
              )}

              {/* KYC badge */}
              <div className="flex items-center gap-1 mt-1">
                <HugeiconsIcon
                  icon={SecurityValidationIcon}
                  size={13}
                  color={user?.kyc_verified ? '#16A34A' : '#D97706'}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: user?.kyc_verified ? '#16A34A' : '#D97706' }}
                >
                  {user?.kyc_verified
                    ? `KYC Verified · Level ${user.kyc_level}`
                    : 'KYC Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Referral Card ──────────────────────────────── */}
        <div
          className="w-full rounded-2xl p-5 mb-4"
          style={{ backgroundColor: '#141418' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon icon={GiftCard02Icon} size={16} color="#8B5CF6" />
            <p className="text-sm font-semibold text-white">Referral Code</p>
          </div>

          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#0A0A0F' }}
          >
            <span className="text-white font-mono font-semibold tracking-widest text-sm">
              {user?.referral_code || '—'}
            </span>

            {/* Copy button */}
            <button
              onClick={copyReferral}
              className="flex items-center gap-1.5 transition-all active:scale-90"
            >
              <HugeiconsIcon
                icon={copied ? Tick01Icon : Copy01Icon}
                size={16}
                color={copied ? '#16A34A' : '#8B5CF6'}
              />
              <span
                className="text-xs font-medium"
                style={{ color: copied ? '#16A34A' : '#8B5CF6' }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>

          <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
            Share your code and earn on every referral
          </p>
        </div>

        {/* ── Menu Items ─────────────────────────────────── */}
        <div className="mb-2">
          <MenuItem
            icon={CustomerSupportIcon}
            label="Customer Support"
            color="#8B5CF6"
            onClick={() => setShowSupport(true)}
          />
          <MenuItem
            icon={SecurityValidationIcon}
            label="KYC Level"
            value={`Level ${user?.kyc_level ?? 0}`}
            color="#16A34A"
          />
          <MenuItem
            icon={Logout01Icon}
            label="Close App"
            color="#DC2626"
            onClick={() => {
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(window as any).Telegram?.WebApp?.close()
              } catch {
                window.close()
              }
            }}
          />
        </div>
      </div>

      {/* ── Support Chat Overlay ──────────────────────────── */}
      {showSupport && (
        <SupportChat onClose={() => setShowSupport(false)} />
      )}
    </>
  )
}

export default Profile