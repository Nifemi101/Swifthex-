// ============================================================
// SwiftyEx TWA — Transaction History Page
// Shows paginated, filterable transaction history
// Uses real API data with mock fallback
// ============================================================

import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Exchange01Icon,
  FilterIcon,
} from '@hugeicons/core-free-icons'
import useTransactions from '../../hooks/useTransaction'
import { TransactionItemSkeleton } from '../UI/skeleton'
import { formatBalance, formatDate } from '../../utils/formatCurrency'
import type { Transaction, TransactionStatus, WalletFilter } from '../../types'

// ============================================================
// Status badge config
// ============================================================
const statusConfig: Record<TransactionStatus, { color: string; bg: string; label: string }> = {
  success: { color: '#16A34A', bg: '#052E16', label: 'Success' },
  pending: { color: '#D97706', bg: '#1C1107', label: 'Pending' },
  failed:  { color: '#DC2626', bg: '#1C0606', label: 'Failed'  },
}

// ============================================================
// Transaction type icon and color
// ============================================================
const typeConfig = {
  deposit:    { icon: ArrowDown01Icon, color: '#16A34A', label: 'Deposit'    },
  withdrawal: { icon: ArrowUp01Icon,   color: '#DC2626', label: 'Withdrawal' },
  swap:       { icon: Exchange01Icon,  color: '#8B5CF6', label: 'Swap'       },
}

// ============================================================
// Filter tabs
// ============================================================
const FILTERS: { label: string; value: WalletFilter }[] = [
  { label: 'All',     value: ''         },
  { label: 'Naira',   value: 'naira'    },
  { label: 'USDT',    value: 'usdt'     },
  { label: 'BTC',     value: 'btc'      },
  { label: 'ETH',     value: 'ethereum' },
]

// ============================================================
// Transaction Item — single row in the list
// ============================================================
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const type    = typeConfig[transaction.type]
  const status  = statusConfig[transaction.status]

  return (
    <div
      className="w-full flex items-center justify-between p-4 rounded-2xl mb-2"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="flex items-center gap-3">
        {/* Type icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${type.color}18` }}
        >
          <HugeiconsIcon
            icon={type.icon}
            size={18}
            color={type.color}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col">
          {/* Description */}
          <span className="text-white text-sm font-medium">
            {transaction.description || type.label}
          </span>
          {/* Date */}
          <span className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {formatDate(transaction.created_at)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        {/* Amount */}
        <span className="text-white text-sm font-semibold">
          {transaction.type === 'withdrawal' ? '- ' : '+ '}
          {formatBalance(transaction.amount, transaction.wallet_type)}
        </span>

        {/* Status badge */}
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>
    </div>
  )
}

// ============================================================
// Transaction History Page
// ============================================================
const TransactionHistory = () => {
  const {
    transactions,
    loading,
    filter,
    setFilter,
    currentPage,
    totalPages,
    loadMore,
  } = useTransactions()

  return (
    <div className="flex flex-col w-full mx-auto max-w-md md:max-w-xl lg:max-w-2xl px-4 md:px-6 pt-6 md:pt-8 pb-4">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-xl md:text-2xl font-bold">History</h1>
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            All your transactions
          </p>
        </div>

        <HugeiconsIcon
          icon={FilterIcon}
          size={20}
          color="#6B7280"
          strokeWidth={1.5}
        />
      </div>

      {/* ── Filter Tabs ───────────────────────────────────── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => {
          const isActive = filter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? '#8B5CF6' : '#141418',
                color: isActive ? '#FFFFFF' : '#6B7280',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* ── Transaction List ──────────────────────────────── */}
      {loading ? (
        // Show 5 skeleton rows while loading
        Array.from({ length: 5 }).map((_, i) => (
          <TransactionItemSkeleton key={i} />
        ))
      ) : transactions.length > 0 ? (
        <>
          {transactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}

          {/* ── Load More Button ─────────────────────────── */}
          {currentPage < totalPages && (
            <button
              onClick={loadMore}
              className="w-full py-3 rounded-2xl text-sm font-medium mt-2 transition-all active:scale-95"
              style={{ backgroundColor: '#141418', color: '#8B5CF6' }}
            >
              Load More
            </button>
          )}
        </>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#141418' }}
          >
            <HugeiconsIcon
              icon={Exchange01Icon}
              size={24}
              color="#6B7280"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-sm font-medium text-white mb-1">
            No transactions yet
          </p>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Your transaction history will appear here
          </p>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory