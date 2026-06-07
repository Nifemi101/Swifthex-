// ============================================================
// SwiftyEx TWA — Market Rates Page
// Shows live buy/sell rates fetched from /miniapp/rates
// Auto refreshes every 30 seconds
// ============================================================

import { HugeiconsIcon } from '@hugeicons/react'
import { RefreshIcon } from '@hugeicons/core-free-icons'
import useRates from '../../hooks/useRate'
import { RateCardSkeleton } from '../UI/skeleton'

// ============================================================
// Rate visual config — color and letter per asset
// ============================================================
const assetConfig: Record<string, { color: string; letter: string; label: string }> = {
  usdnaira:  { color: '#16A34A', letter: '$',  label: 'USD / NGN'  },
  btcnaira:  { color: '#D97706', letter: '₿',  label: 'BTC / NGN'  },
  ethnaira:  { color: '#7C3AED', letter: 'Ξ',  label: 'ETH / NGN'  },
  usdtnaira: { color: '#2563EB', letter: '₮',  label: 'USDT / NGN' },
}

// Fallback config for unknown symbols
const getAssetConfig = (symbol: string) => {
  return (
    assetConfig[symbol.toLowerCase()] || {
      color: '#6B7280',
      letter: symbol.charAt(0).toUpperCase(),
      label: symbol.toUpperCase(),
    }
  )
}

// ============================================================
// Rate Card — individual asset row
// ============================================================
const RateCard = ({
  symbol,
  buy,
  sell,
}: {
  symbol: string
  buy: string
  sell: string
}) => {
  const config = getAssetConfig(symbol)

  // Format rate with NGN symbol and comma separators
  const formatRate = (rate: string) => {
    const num = parseFloat(rate)
    return `₦${num.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <div
      className="w-full rounded-2xl p-4 mb-3"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="flex items-center gap-3 mb-4">
        {/* Asset icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: config.color }}
        >
          {config.letter}
        </div>

        {/* Asset label */}
        <div>
          <p className="text-white font-semibold text-sm">{config.label}</p>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            SwiftyEx Rate
          </p>
        </div>
      </div>

      {/* Buy and Sell rates */}
      <div
        className="flex justify-between rounded-xl p-3"
        style={{ backgroundColor: '#0A0A0F' }}
      >
        {/* Buy rate */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
            BUY
          </span>
          <span className="text-white font-bold text-sm">
            {formatRate(buy)}
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-px self-stretch"
          style={{ backgroundColor: '#1E1E2A' }}
        />

        {/* Sell rate */}
        <div className="flex flex-col gap-1 items-end">
          <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
            SELL
          </span>
          <span className="font-bold text-sm" style={{ color: '#8B5CF6' }}>
            {formatRate(sell)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Market Rates Page
// ============================================================
const MarketRates = () => {
  const { rates, loading, lastUpdated, refetch } = useRates()

  return (
    <div className="flex flex-col px-4 pt-6 pb-4">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-xl font-bold">Live Rates</h1>
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : 'Fetching rates...'}
          </p>
        </div>

        {/* Manual refresh button */}
        <button
          onClick={refetch}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: '#141418' }}
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={18}
            color="#8B5CF6"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* ── Rate Cards ───────────────────────────────────── */}
      {loading ? (
        // Show 3 skeleton cards while fetching
        Array.from({ length: 3 }).map((_, i) => (
          <RateCardSkeleton key={i} />
        ))
      ) : rates.length > 0 ? (
        rates.map((rate) => (
          <RateCard
            key={rate.symbol}
            symbol={rate.symbol}
            buy={rate.buy}
            sell={rate.sell}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            No rates available
          </p>
          <button
            onClick={refetch}
            className="mt-4 px-6 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: '#8B5CF6', color: '#FFFFFF' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Auto refresh note ────────────────────────────── */}
      {!loading && rates.length > 0 && (
        <p className="text-center text-xs mt-2" style={{ color: '#374151' }}>
          Rates refresh automatically every 30 seconds
        </p>
      )}
    </div>
  )
}

export default MarketRates