// ============================================================
// SwiftyEx TWA — useUser Hook
// Fetches user profile — prioritizes Telegram SDK for name
// ============================================================

import { useState, useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import { fetchUser } from '../service/api'
import { mockUser } from '../data/mockData'
import type { User } from '../types'

interface UseUserReturn {
  user: User | null
  loading: boolean
  error: string | null
}

// ── Read real Telegram user from SDK ────────────────────────
const getTelegramUser = () => {
  const sdkUser = WebApp.initDataUnsafe?.user
  if (sdkUser?.id) return sdkUser

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    const windowUser = win.__TG_USER__ || win.Telegram?.WebApp?.initDataUnsafe?.user
    if (windowUser?.id) return windowUser
  } catch {
    // not inside Telegram
  }

  return null
}

// ── Generate referral code from name + Telegram ID ──────────
// Format: SWIFT-[first 3 letters of name][last 3 digits of ID]
// e.g. Nifemi with ID 123456789 → SWIFT-NIF789
const generateReferralCode = (firstName: string, userId: number): string => {
  const prefix = firstName.slice(0, 3).toUpperCase().padEnd(3, 'X')
  const suffix = String(userId).slice(-3).padStart(3, '0')
  return `SWIFT-${prefix}${suffix}`
}

const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)

      // Always read Telegram user first — synchronous
      const tgUser = getTelegramUser()

      try {
        // Try the real API
        const data = await fetchUser()

        setUser({
          ...data,
          first_name: tgUser?.first_name || data.first_name,
          username:   tgUser?.username   || data.username,
        })
      } catch {
        // API failed — build user from Telegram SDK + mock
        if (tgUser) {
          setUser({
            ...mockUser,
            chat_id:       String(tgUser.id),
            username:      tgUser.username   || '',
            first_name:    tgUser.first_name || 'Swiftronaut',
            // Generate referral code from real name + Telegram ID
            referral_code: generateReferralCode(
              tgUser.first_name || 'USR',
              tgUser.id
            ),
          })
        } else {
          setUser(mockUser)
        }
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  return { user, loading, error }
}

export default useUser