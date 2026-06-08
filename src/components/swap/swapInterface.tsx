// ============================================================
// SwiftyEx TWA — Swap Interface Page
// Visual swap form with live rate calculation
// ============================================================

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpDownIcon } from '@hugeicons/core-free-icons'
import useRates from '../../hooks/useRate'
import { SwapInterfaceSkeleton } from '../UI/skeleton'
import { formatNGN } from '../../utils/formatCurrency'

// ============================================================
// Supported tokens
// ============================================================
const TOKENS = [
  { symbol: 'NGN',  label: 'Naira',    letter: '₦', color: '#16A34A' },
  { symbol: 'USDT', label: 'USDT',     letter: '₮', color: '#2563EB' },
  { symbol: 'BTC',  label: 'Bitcoin',  letter: '₿', color: '#D97706' },
  { symbol: 'ETH',  label: 'Ethereum', letter: 'Ξ', color: '#7C3AED' },
]

// Maps token pair to the rate symbol from the API
const RATE_MAP: Record<string, string> = {
  'USDT-NGN': 'usdnaira',
  'NGN-USDT': 'usdnaira',
  'BTC-NGN':  'btcnaira',
  'NGN-BTC':  'btcnaira',
  'ETH-NGN':  'ethnaira',
  'NGN-ETH':  'ethnaira',
}

// ============================================================
// Token Icon
// ============================================================
const TokenIcon = ({ symbol, size = 36 }: { symbol: string; size?: number }) => {
  const token = TOKENS.find(t => t.symbol === symbol) || TOKENS[0]
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        backgroundColor: token.color,
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
    >
      {token.letter}
    </div>
  )
}

// ============================================================
// Swap Interface Page
// ============================================================
const SwapInterface = () => {
  const { rates, loading: ratesLoading } = useRates()

  const [fromToken, setFromToken] = useState<string>('USDT')
  const [toToken, setToToken]     = useState<string>('NGN')
  const [amount, setAmount]       = useState<string>('')
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker]     = useState(false)

  // ── Swap token positions ─────────────────────────────────
  const flipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  // ── Calculate estimated output based on live rates ───────
  const getEstimate = (): string => {
    if (!amount || isNaN(parseFloat(amount))) return '0.00'

    const inputAmount = parseFloat(amount)
    const pairKey     = `${fromToken}-${toToken}`
    const rateSymbol  = RATE_MAP[pairKey]

    if (!rateSymbol) return '—'

    const rate = rates.find(r => r.symbol.toLowerCase() === rateSymbol)
    if (!rate) return '—'

    const buyRate  = parseFloat(rate.buy)
    const sellRate = parseFloat(rate.sell)

    if (toToken === 'NGN') {
      // Selling crypto → multiply by sell rate
      const result = inputAmount * sellRate
      return formatNGN(result)
    } else if (fromToken === 'NGN') {
      // Buying crypto → divide by buy rate
      const result = inputAmount / buyRate
      const decimals = toToken === 'BTC' || toToken === 'ETH' ? 8 : 2
      return `${result.toFixed(decimals)} ${toToken}`
    }

    return '—'
  }

  // ── Send swap command to bot ─────────────────────────────
  const handleSwap = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        tg.sendData('🔄 Swap Crypto')
      } else {
        window.open('https://t.me/SwiftyEx_bot', '_blank')
      }
    } catch {
      window.open('https://t.me/SwiftyEx_bot', '_blank')
    }
  }

  // ── Token Picker Dropdown ────────────────────────────────
  const TokenPicker = ({
    selected,
    exclude,
    onSelect,
    onClose,
  }: {
    selected: string
    exclude: string
    onSelect: (s: string) => void
    onClose: () => void
  }) => (
    <div
      className="absolute left-0 right-0 z-10 rounded-2xl overflow-hidden shadow-xl"
      style={{ backgroundColor: '#1A1A24', top: '100%', marginTop: 4 }}
    >
      {TOKENS.filter(t => t.symbol !== exclude).map(token => (
        <button
          key={token.symbol}
          onClick={() => { onSelect(token.symbol); onClose() }}
          className="w-full flex items-center gap-3 px-4 py-3 transition-all"
          style={{
            backgroundColor: selected === token.symbol ? '#1E1B2E' : 'transparent',
          }}
        >
          <TokenIcon symbol={token.symbol} size={32} />
          <div className="flex flex-col items-start">
            <span className="text-white text-sm font-medium">{token.symbol}</span>
            <span className="text-xs" style={{ color: '#6B7280' }}>{token.label}</span>
          </div>
        </button>
      ))}
    </div>
  )

  if (ratesLoading) return (
    <div className="px-4 pt-6">
      <SwapInterfaceSkeleton />
    </div>
  )

  // Get current rate for the selected pair
  const currentRateSymbol = RATE_MAP[`${fromToken}-${toToken}`]
  const currentRate = rates.find(r => r.symbol.toLowerCase() === currentRateSymbol)

  return (
    <div className="flex flex-col px-4 pt-6 pb-4">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-white text-xl font-bold">Swap</h1>
        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
          Live rates from SwiftyEx
        </p>
      </div>

      {/* ── From Token ───────────────────────────────────── */}
      <div
        className="relative w-full rounded-2xl p-4 mb-1"
        style={{ backgroundColor: '#141418' }}
      >
        <p className="text-xs mb-3 font-medium" style={{ color: '#6B7280' }}>
          FROM
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setShowFromPicker(p => !p); setShowToPicker(false) }}
            className="flex items-center gap-2"
          >
            <TokenIcon symbol={fromToken} size={36} />
            <div className="flex flex-col items-start">
              <span className="text-white font-semibold">{fromToken}</span>
              <span className="text-xs" style={{ color: '#6B7280' }}>
                {TOKENS.find(t => t.symbol === fromToken)?.label}
              </span>
            </div>
            <span style={{ color: '#6B7280', fontSize: 10 }}>▼</span>
          </button>

          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent text-right text-white text-lg font-bold outline-none w-32"
            style={{ caretColor: '#8B5CF6' }}
          />
        </div>

        {showFromPicker && (
          <TokenPicker
            selected={fromToken}
            exclude={toToken}
            onSelect={setFromToken}
            onClose={() => setShowFromPicker(false)}
          />
        )}
      </div>

      {/* ── Flip Button ──────────────────────────────────── */}
      <div className="flex justify-center my-1 relative z-20">
        <button
          onClick={flipTokens}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: '#8B5CF6' }}
        >
          <HugeiconsIcon icon={ArrowUpDownIcon} size={18} color="#FFFFFF" strokeWidth={2} />
        </button>
      </div>

      {/* ── To Token ─────────────────────────────────────── */}
      <div
        className="relative w-full rounded-2xl p-4 mb-4"
        style={{ backgroundColor: '#141418' }}
      >
        <p className="text-xs mb-3 font-medium" style={{ color: '#6B7280' }}>
          TO (ESTIMATED)
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setShowToPicker(p => !p); setShowFromPicker(false) }}
            className="flex items-center gap-2"
          >
            <TokenIcon symbol={toToken} size={36} />
            <div className="flex flex-col items-start">
              <span className="text-white font-semibold">{toToken}</span>
              <span className="text-xs" style={{ color: '#6B7280' }}>
                {TOKENS.find(t => t.symbol === toToken)?.label}
              </span>
            </div>
            <span style={{ color: '#6B7280', fontSize: 10 }}>▼</span>
          </button>

          {/* Live estimated output */}
          <span
            className="text-lg font-bold"
            style={{ color: amount ? '#8B5CF6' : '#6B7280' }}
          >
            {amount ? getEstimate() : '0.00'}
          </span>
        </div>

        {showToPicker && (
          <TokenPicker
            selected={toToken}
            exclude={fromToken}
            onSelect={setToToken}
            onClose={() => setShowToPicker(false)}
          />
        )}
      </div>

      {/* ── Current Rate Info ─────────────────────────────── */}
      {currentRate && (
        <div
          className="w-full rounded-2xl p-4 mb-4 flex justify-between items-center"
          style={{ backgroundColor: '#141418' }}
        >
          <span className="text-xs font-medium uppercase" style={{ color: '#6B7280' }}>
            Rate
          </span>
          <div className="flex gap-4">
            <span className="text-xs text-white">
              Buy ₦{parseFloat(currentRate.buy).toLocaleString()}
            </span>
            <span className="text-xs" style={{ color: '#8B5CF6' }}>
              Sell ₦{parseFloat(currentRate.sell).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* ── Swap Button ───────────────────────────────────── */}
      <button
        onClick={handleSwap}
        disabled={!amount || fromToken === toToken}
        className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
        style={{
          backgroundColor: !amount || fromToken === toToken ? '#1E1E2A' : '#8B5CF6',
          color: !amount || fromToken === toToken ? '#6B7280' : '#FFFFFF',
        }}
      >
        {fromToken === toToken
          ? 'Select different tokens'
          : `Swap ${fromToken} → ${toToken}`}
      </button>

      <p className="text-center text-xs mt-3" style={{ color: '#374151' }}>
        Swap is executed via the SwiftyEx bot
      </p>
    </div>
  )
}

export default SwapInterface