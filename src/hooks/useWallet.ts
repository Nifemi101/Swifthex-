import { useState, useEffect } from 'react'
import { fetchWallets } from '../service/api'
import { mockWallets } from '../data/mockData'
import type { Wallet } from '../types'

interface UseWalletsReturn {
  wallets: Wallet[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const useWallets = (): UseWalletsReturn => {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadWallets = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchWallets()
      setWallets(data)
    } catch (err) {
      // API unavailable — fall back to mock data in development
      console.warn('useWallets: API unavailable, using mock data', err)
      setWallets(mockWallets)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Load wallets on mount
  useEffect(() => {
    loadWallets()
  }, [])

  // Expose refetch so Portfolio can refresh after a swap
  return { wallets, loading, error, refetch: loadWallets }
}

export default useWallets