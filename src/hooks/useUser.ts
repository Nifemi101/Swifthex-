// ============================================================
// SwiftyEx TWA — useUser Hook
// Fetches user profile from /miniapp/me
// Falls back to Telegram SDK for real name when API fails
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

const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)

        // First try the real API
        const data = await fetchUser()
        setUser(data)

      } catch (err) {
        console.warn('useUser: API unavailable, checking Telegram SDK', err)

        try {
          // Get real user data directly from Telegram SDK
          const tgUser = WebApp.initDataUnsafe?.user

          if (tgUser) {
            // Inside Telegram — use real name, fallback mock for balances
            setUser({
              ...mockUser,
              chat_id:    String(tgUser.id),
              username:   tgUser.username   || '',
              first_name: tgUser.first_name || 'Swiftronaut',
            })
          } else {
            // Outside Telegram — use full mock data
            setUser(mockUser)
          }
        } catch {
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