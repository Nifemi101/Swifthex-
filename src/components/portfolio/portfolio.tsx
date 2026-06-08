// ============================================================
// SwiftyEx TWA — Portfolio Page
// Shows total balance, individual wallet cards
// Uses real API data with mock fallback
// ============================================================

import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  EyeIcon,
  EyeOffIcon,
} from '@hugeicons/core-free-icons'
import { useState } from 'react'
import useUser from '../../hooks/useUser'
import useWallets from '../../hooks/useWallet'
import useRates from '../../hooks/useRate'
import {
  BalanceHeaderSkeleton,
  WalletCardSkeleton,
} from '../UI/skeleton'
import { formatBalance, formatNGN } from '../../utils/formatCurrency'
import type { Wallet } from '../../types'

// ============================================================
// Wallet visual config — color and letter per wallet type
// ============================================================
const walletConfig: Record<string, { color: string; letter: string; label: string }> = {
  naira:    { color: '#16A34A', letter: '₦', label: 'Naira'    },
  usdt:     { color: '#2563EB', letter: '$', label: 'USDT'     },
  btc:      { color: '#D97706', letter: '₿', label: 'Bitcoin'  },
  ethereum: { color: '#7C3AED', letter: 'Ξ', label: 'Ethereum' },
}

// ============================================================
// Wallet Card — individual wallet row
// ============================================================
const WalletCard = ({ wallet }: { wallet: Wallet }) => {
  const config = walletConfig[wallet.wallet_type] || {
    color: '#6B7280',
    letter: '?',
    label: wallet.wallet_type,
  }

  return (
    <div
      className="w-full flex items-center justify-between p-4 rounded-2xl mb-3"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="flex items-center gap-3">
        {/* Wallet icon — colored circle with currency letter */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: config.color }}
        >
          {config.letter}
        </div>

        <div className="flex flex-col">
          {/* Wallet label */}
          <span className="text-white text-sm font-medium">
            {config.label}
          </span>
          {/* Blockchain type */}
          <span className="text-xs" style={{ color: '#6B7280' }}>
            {wallet.blockchain}
          </span>
        </div>
      </div>

      {/* Balance */}
      <span className="text-white text-sm font-semibold">
        {formatBalance(wallet.balance, wallet.wallet_type)}
      </span>
    </div>
  )
}

// ============================================================
// Portfolio Page
// ============================================================
const Portfolio = () => {
  const { user, loading: userLoading } = useUser()
  const { wallets, loading: walletsLoading } = useWallets()
  const { rates } = useRates()

  // Toggle to show or hide balance amounts
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true)

  // ── Open bot with a specific action ───────────────────────
  // Deposit and Withdraw redirect to the SwiftyEx bot
  const openBot = (action: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        tg.openTelegramLink(`https://t.me/SwiftyEx_bot?start=${action}`)
      } else {
        window.open('https://t.me/SwiftyEx_bot', '_blank')
      }
    } catch {
      window.open('https://t.me/SwiftyEx_bot', '_blank')
    }
  }

  // ── Total balance calculation ──────────────────────────────
  // Converts all wallet balances to NGN equivalent using live rates
  const calculateTotalNGN = (): number => {
    const usdRate = rates.find(r => r.symbol === 'usdnaira')
    const usdSellRate = usdRate ? parseFloat(usdRate.sell) : 1600

    return wallets.reduce((total, wallet) => {
      switch (wallet.wallet_type) {
        case 'naira':
          return total + wallet.balance
        case 'usdt':
          // USDT ≈ USD, multiply by NGN sell rate
          return total + wallet.balance * usdSellRate
        case 'btc':
          // Approximate BTC in NGN (no BTC rate yet from API)
          return total + wallet.balance * 98500000
        case 'ethereum':
          // Approximate ETH in NGN (no ETH rate yet from API)
          return total + wallet.balance * 5200000
        default:
          return total
      }
    }, 0)
  }

  // ── Greeting based on time of day ─────────────────────────
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const isLoading = userLoading || walletsLoading

  return (
    <div className="flex flex-col px-4 pt-6 pb-4">

      {/* ── Greeting ─────────────────────────────────────── */}
      <div className="mb-5">
        {userLoading ? (
          <div
            className="animate-pulse h-4 w-36 rounded-lg"
            style={{ backgroundColor: '#1E1E2A' }}
          />
        ) : (
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {getGreeting()},
            </p>
            <h1 className="text-white text-xl font-bold">
              {user?.first_name || 'Swiftronaut'}
            </h1>
          </div>
        )}
      </div>

      {/* ── Total Balance Card ───────────────────────────── */}
      {isLoading ? (
        <BalanceHeaderSkeleton />
      ) : (
        <div
          className="w-full rounded-2xl p-6 mb-4"
          style={{ backgroundColor: '#141418' }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
              Total Portfolio Value
            </p>

            {/* Hide / show balance toggle */}
            <button onClick={() => setBalanceVisible(prev => !prev)}>
              <HugeiconsIcon
                icon={balanceVisible ? EyeIcon : EyeOffIcon}
                size={18}
                color="#6B7280"
              />
            </button>
          </div>

          {/* Total NGN balance */}
          <h2 className="text-white text-3xl font-bold mb-1">
            {balanceVisible ? formatNGN(calculateTotalNGN()) : '₦ ••••••'}
          </h2>

          {/* KYC badge */}
          {user?.kyc_verified && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-500">
                KYC Verified — Level {user.kyc_level}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Wallets Section ──────────────────────────────── */}
      <div className="mb-2">
        <p className="text-xs font-semibold mb-3" style={{ color: '#6B7280' }}>
          MY WALLETS
        </p>

        {isLoading ? (
          // Show 4 skeleton cards while loading
          Array.from({ length: 4 }).map((_, i) => (
            <WalletCardSkeleton key={i} />
          ))
        ) : wallets.length > 0 ? (
          wallets.map((wallet) => (
            <WalletCard key={wallet.wallet_type} wallet={wallet} />
          ))
        ) : (
          <p className="text-center text-sm py-8" style={{ color: '#6B7280' }}>
            No wallets found
          </p>
        )}
      </div>

      {/* ── Quick Actions ────────────────────────────────── */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => openBot('deposit')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm transition-all active:scale-95"
          style={{ backgroundColor: '#8B5CF6', color: '#FFFFFF' }}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} color="#FFFFFF" />
          Deposit
        </button>

        <button
          onClick={() => openBot('withdraw')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm transition-all active:scale-95"
          style={{ backgroundColor: '#141418', color: '#FFFFFF' }}
        >
          <HugeiconsIcon icon={ArrowUp01Icon} size={16} color="#FFFFFF" />
          Withdraw
        </button>
      </div>
    </div>
  )
}

export default Portfolio