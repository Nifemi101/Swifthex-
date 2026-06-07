import { useState, useEffect } from 'react'
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

        // API failed — try to get real name from Telegram SDK directly
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user

          if (tgUser) {
            // Real Telegram user data — merge with mock for balance fields
            setUser({
              ...mockUser,
              chat_id: String(tgUser.id),
              username: tgUser.username || '',
              first_name: tgUser.first_name || '',
            })
          } else {
            // Not inside Telegram — use full mock data
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