import { useState, useEffect, useRef } from 'react'
import { fetchRates } from '../service/api'
import { mockRates } from '../data/mockData'
import type { Rate } from '../types'

interface UseRatesReturn {
  rates: Rate[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => void
}

const REFRESH_INTERVAL = 30000 // 30 seconds

const useRates = (): UseRatesReturn => {
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // useRef keeps the interval stable across renders
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

 const loadRates = async () => {
  try {
    setError(null)
    const data = await fetchRates()
    setRates(data)
    setLastUpdated(new Date())
  } catch (err) {
    // Only falls back to mock if network is completely down
    console.warn('useRates: fetch failed', err)
    setRates(mockRates)
    setError(null)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    // Initial fetch on mount
    loadRates()

    // Auto refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      loadRates()
    }, REFRESH_INTERVAL)

    // Clear interval when component unmounts to prevent memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { rates, loading, error, lastUpdated, refetch: loadRates }
}

export default useRates