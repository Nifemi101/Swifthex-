// ============================================================
// SwiftyEx TWA — Swap Interface Page
// Visual swap form with AI Swap Advisor powered by Groq
// Swap execution redirects to the bot (no swap API endpoint)
// ============================================================

import { useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUpDownIcon,
  InformationCircleIcon,
  Tick01Icon,
  TimeQuarterPassIcon,
} from '@hugeicons/core-free-icons'
import useRates from '../../hooks/useRate'
import { useSwapAdvisor } from '../../hooks/useGroqAi'
import { SwapInterfaceSkeleton } from '../UI/skeleton'
import type { SwapAdvisorResponse } from '../../types'

// ============================================================
// Supported tokens for swapping
// ============================================================
const TOKENS = [
  { symbol: 'NGN',  label: 'Naira',    letter: '₦', color: '#16A34A' },
  { symbol: 'USDT', label: 'USDT',     letter: '₮', color: '#2563EB' },
  { symbol: 'BTC',  label: 'Bitcoin',  letter: '₿', color: '#D97706' },
  { symbol: 'ETH',  label: 'Ethereum', letter: 'Ξ', color: '#7C3AED' },
]

// ============================================================
// Token Icon — colored circle with currency letter
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
// AI Advisor Card — shows recommendation from Groq
// ============================================================
const AdvisorCard = ({
  advice,
  loading,
}: {
  advice: SwapAdvisorResponse | null
  loading: boolean
}) => {
  if (loading) {
    return (
      <div
        className="w-full rounded-2xl p-4 flex items-center gap-3"
        style={{ backgroundColor: '#141418' }}
      >
        <div
          className="w-4 h-4 rounded-full animate-pulse flex-shrink-0"
          style={{ backgroundColor: '#8B5CF6' }}
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="animate-pulse h-3 w-24 rounded" style={{ backgroundColor: '#1E1E2A' }} />
          <div className="animate-pulse h-3 w-full rounded" style={{ backgroundColor: '#1E1E2A' }} />
        </div>
      </div>
    )
  }

  if (!advice) return null

  // Color and icon per recommendation type
  const config = {
    good:    { color: '#16A34A', icon: Tick01Icon,        label: 'Good time to swap' },
    wait:    { color: '#D97706', icon: TimeQuarterPassIcon, label: 'Consider waiting' },
    neutral: { color: '#6B7280', icon: InformationCircleIcon, label: 'Neutral' },
  }[advice.recommendation]

  return (
    <div
      className="w-full rounded-2xl p-4"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <HugeiconsIcon icon={config.icon} size={14} color={config.color} />
        <span className="text-xs font-semibold" style={{ color: config.color }}>
          AI Advisor — {config.label}
        </span>
      </div>
      <p className="text-sm" style={{ color: '#9CA3AF' }}>
        {advice.message}
      </p>
    </div>
  )
}

// ============================================================
// Swap Interface Page
// ============================================================
const SwapInterface = () => {
  const { rates, loading: ratesLoading } = useRates()
  const { advice, loading: advisorLoading, getAdvice } = useSwapAdvisor()

  const [fromToken, setFromToken] = useState<string>('USDT')
  const [toToken, setToToken]     = useState<string>('NGN')
  const [amount, setAmount]       = useState<string>('')
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker]     = useState(false)

  // ── Fetch AI advice when tokens change ──────────────────
  useEffect(() => {
    if (rates.length > 0 && fromToken !== toToken) {
      getAdvice(fromToken, toToken, rates)
    }
  }, [fromToken, toToken, rates])

  // ── Swap token positions ─────────────────────────────────
  const flipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  // ── Calculate estimated output ───────────────────────────
  const getEstimate = (): string => {
    if (!amount || isNaN(parseFloat(amount))) return '0.00'
    const rate = rates.find(r =>
      r.symbol.toLowerCase().includes(fromToken.toLowerCase()) ||
      r.symbol.toLowerCase().includes(toToken.toLowerCase())
    )
    if (!rate) return '—'
    const result = parseFloat(amount) * parseFloat(rate.sell)
    return result.toLocaleString('en-NG', { maximumFractionDigits: 6 })
  }

  // ── Open bot to execute swap ─────────────────────────────
  const handleSwap = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        tg.openTelegramLink('https://t.me/SwiftyExBot')
      } else {
        window.open('https://t.me/SwiftyExBot', '_blank')
      }
    } catch {
      window.open('https://t.me/SwiftyExBot', '_blank')
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

  return (
    <div className="flex flex-col px-4 pt-6 pb-4">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-white text-xl font-bold">Swap</h1>
        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
          Get AI advice before you swap
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
          {/* Token selector */}
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

          {/* Amount input */}
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent text-right text-white text-lg font-bold outline-none w-32"
            style={{ caretColor: '#8B5CF6' }}
          />
        </div>

        {/* Dropdown picker */}
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
          TO
        </p>
        <div className="flex items-center justify-between">
          {/* Token selector */}
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

          {/* Estimated output */}
          <span className="text-white text-lg font-bold">
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

      {/* ── AI Advisor Card ───────────────────────────────── */}
      <div className="mb-4">
        <AdvisorCard advice={advice} loading={advisorLoading} />
      </div>

      {/* ── Swap Button ───────────────────────────────────── */}
      <button
        onClick={handleSwap}
        disabled={!amount || fromToken === toToken}
        className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-95"
        style={{
          backgroundColor:
            !amount || fromToken === toToken ? '#1E1E2A' : '#8B5CF6',
          color: !amount || fromToken === toToken ? '#6B7280' : '#FFFFFF',
        }}
      >
        {fromToken === toToken
          ? 'Select different tokens'
          : `Swap ${fromToken} → ${toToken}`}
      </button>

      {/* ── Disclaimer ────────────────────────────────────── */}
      <p className="text-center text-xs mt-3" style={{ color: '#374151' }}>
        Swap is executed via the SwiftyEx bot
      </p>
    </div>
  )
}

export default SwapInterface