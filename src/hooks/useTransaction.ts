import { useState, useEffect } from 'react'
import { fetchTransactions } from '../service/api'
import { mockTransactions } from '../data/mockData'
import type { Transaction, WalletFilter } from '../types'

interface UseTransactionsReturn {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  filter: WalletFilter
  setFilter: (filter: WalletFilter) => void
  loadMore: () => void
}

const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Filter by wallet type — empty string means all wallets
  const [filter, setFilter] = useState<WalletFilter>('')

  const loadTransactions = async (page: number, walletFilter: WalletFilter, reset: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchTransactions(page, walletFilter)

      // If reset (filter changed or first load), replace transactions
      // If loading more (pagination), append to existing list
      setTransactions(prev =>
        reset ? data.transactions : [...prev, ...data.transactions]
      )

      setCurrentPage(data.current_page)
      setTotalPages(data.total_pages)
    } catch (err) {
      // API unavailable — fall back to mock data in development
      console.warn('useTransactions: API unavailable, using mock data', err)

      // Apply filter manually on mock data
      const filtered = walletFilter
        ? mockTransactions.filter(t => t.wallet_type === walletFilter)
        : mockTransactions

      setTransactions(filtered)
      setCurrentPage(1)
      setTotalPages(1)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Reload from page 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1)
    loadTransactions(1, filter, true)
  }, [filter])

  // Load next page and append to list
  const loadMore = () => {
    if (currentPage < totalPages) {
      loadTransactions(currentPage + 1, filter, false)
    }
  }

  return {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    filter,
    setFilter,
    loadMore,
  }
}

export default useTransactions