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
// Tries multiple methods to get the real user
const getTelegramUser = () => {
  // Method 1 — @twa-dev/sdk
  const sdkUser = WebApp.initDataUnsafe?.user
  if (sdkUser?.id) {
    console.log('Got user from SDK:', sdkUser)
    return sdkUser
  }

  // Method 2 — window.Telegram.WebApp directly
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user
    if (windowUser?.id) {
      console.log('Got user from window:', windowUser)
      return windowUser
    }
  } catch {
    // not inside Telegram
  }

  console.log('No Telegram user found — using mock data')
  return null
}

const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)

      // Always read Telegram user first — synchronous and reliable
      const tgUser = getTelegramUser()

      try {
        // Try the real API
        const data = await fetchUser()

        // Merge API data with real Telegram name if available
        setUser({
          ...data,
          first_name: tgUser?.first_name || data.first_name,
          username:   tgUser?.username   || data.username,
        })
      } catch {
        // API failed — use Telegram SDK data + mock for balances
        if (tgUser) {
          setUser({
            ...mockUser,
            chat_id:    String(tgUser.id),
            username:   tgUser.username   || '',
            first_name: tgUser.first_name || 'Swiftronaut',
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