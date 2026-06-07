// ============================================================
// SwiftyEx TWA — Skeleton Loaders
// Each skeleton matches the exact shape of its real component.
// Used across all pages while data is being fetched.
// ============================================================

// ============================================================
// Base Skeleton Block
// The building block for all skeletons below
// ============================================================
const SkeletonBlock = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  className = '',
}: {
  width?: string
  height?: string
  rounded?: string
  className?: string
}) => (
  <div
    className={`animate-pulse ${width} ${height} ${rounded} ${className}`}
    style={{ backgroundColor: '#1E1E2A' }}
  />
)

// ============================================================
// Portfolio — Balance Header Skeleton
// Matches the large total balance card at the top of Portfolio
// ============================================================
export const BalanceHeaderSkeleton = () => (
  <div
    className="w-full rounded-2xl p-6 mb-4"
    style={{ backgroundColor: '#141418' }}
  >
    {/* "Total Balance" label */}
    <SkeletonBlock width="w-24" height="h-3" className="mb-3" />

    {/* Large balance amount */}
    <SkeletonBlock width="w-48" height="h-9" rounded="rounded-xl" className="mb-2" />

    {/* Subtext e.g. "≈ $320.00" */}
    <SkeletonBlock width="w-32" height="h-3" />
  </div>
)

// ============================================================
// Portfolio — Wallet Card Skeleton
// Matches each wallet card (Naira, USDT, BTC, ETH)
// ============================================================
export const WalletCardSkeleton = () => (
  <div
    className="w-full rounded-2xl p-4 flex items-center justify-between mb-3"
    style={{ backgroundColor: '#141418' }}
  >
    <div className="flex items-center gap-3">
      {/* Wallet icon circle */}
      <SkeletonBlock width="w-10" height="h-10" rounded="rounded-full" />

      <div className="flex flex-col gap-2">
        {/* Wallet name e.g. "Bitcoin" */}
        <SkeletonBlock width="w-20" height="h-3" />
        {/* Blockchain label e.g. "TRC20" */}
        <SkeletonBlock width="w-14" height="h-2" />
      </div>
    </div>

    {/* Balance on the right */}
    <SkeletonBlock width="w-24" height="h-4" rounded="rounded-lg" />
  </div>
)

// ============================================================
// Rates — Rate Card Skeleton
// Matches each rate card (symbol, buy rate, sell rate)
// ============================================================
export const RateCardSkeleton = () => (
  <div
    className="w-full rounded-2xl p-4 mb-3"
    style={{ backgroundColor: '#141418' }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {/* Asset icon */}
        <SkeletonBlock width="w-8" height="h-8" rounded="rounded-full" />
        {/* Asset name e.g. "USDT" */}
        <SkeletonBlock width="w-16" height="h-4" />
      </div>
      {/* 24hr change badge */}
      <SkeletonBlock width="w-16" height="h-6" rounded="rounded-full" />
    </div>

    <div className="flex justify-between">
      <div className="flex flex-col gap-1">
        {/* "Buy" label */}
        <SkeletonBlock width="w-8" height="h-2" />
        {/* Buy rate */}
        <SkeletonBlock width="w-28" height="h-4" />
      </div>
      <div className="flex flex-col gap-1 items-end">
        {/* "Sell" label */}
        <SkeletonBlock width="w-8" height="h-2" />
        {/* Sell rate */}
        <SkeletonBlock width="w-28" height="h-4" />
      </div>
    </div>
  </div>
)

// ============================================================
// Transactions — Transaction Item Skeleton
// Matches each row in the transaction history list
// ============================================================
export const TransactionItemSkeleton = () => (
  <div
    className="w-full flex items-center justify-between p-4 rounded-2xl mb-2"
    style={{ backgroundColor: '#141418' }}
  >
    <div className="flex items-center gap-3">
      {/* Transaction type icon */}
      <SkeletonBlock width="w-10" height="h-10" rounded="rounded-full" />

      <div className="flex flex-col gap-2">
        {/* Transaction description e.g. "USDT to NGN" */}
        <SkeletonBlock width="w-32" height="h-3" />
        {/* Date */}
        <SkeletonBlock width="w-20" height="h-2" />
      </div>
    </div>

    <div className="flex flex-col gap-2 items-end">
      {/* Amount */}
      <SkeletonBlock width="w-20" height="h-3" />
      {/* Status badge */}
      <SkeletonBlock width="w-16" height="h-5" rounded="rounded-full" />
    </div>
  </div>
)

// ============================================================
// Swap — Swap Interface Skeleton
// Matches the full swap form layout
// ============================================================
export const SwapInterfaceSkeleton = () => (
  <div className="w-full flex flex-col gap-3">
    {/* From token selector */}
    <div
      className="w-full rounded-2xl p-4"
      style={{ backgroundColor: '#141418' }}
    >
      <SkeletonBlock width="w-12" height="h-2" className="mb-3" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBlock width="w-8" height="h-8" rounded="rounded-full" />
          <SkeletonBlock width="w-16" height="h-4" />
        </div>
        <SkeletonBlock width="w-28" height="h-6" />
      </div>
    </div>

    {/* Swap arrow button */}
    <div className="flex justify-center">
      <SkeletonBlock width="w-10" height="h-10" rounded="rounded-full" />
    </div>

    {/* To token selector */}
    <div
      className="w-full rounded-2xl p-4"
      style={{ backgroundColor: '#141418' }}
    >
      <SkeletonBlock width="w-8" height="h-2" className="mb-3" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBlock width="w-8" height="h-8" rounded="rounded-full" />
          <SkeletonBlock width="w-16" height="h-4" />
        </div>
        <SkeletonBlock width="w-28" height="h-6" />
      </div>
    </div>

    {/* AI Advisor card */}
    <div
      className="w-full rounded-2xl p-4"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBlock width="w-4" height="h-4" rounded="rounded-full" />
        <SkeletonBlock width="w-24" height="h-3" />
      </div>
      <SkeletonBlock width="w-full" height="h-3" className="mb-2" />
      <SkeletonBlock width="w-3/4" height="h-3" />
    </div>

    {/* Swap button */}
    <SkeletonBlock width="w-full" height="h-12" rounded="rounded-2xl" />
  </div>
)

// ============================================================
// Profile — Profile Header Skeleton
// Matches the user profile section at the top of the Profile tab
// ============================================================
export const ProfileSkeleton = () => (
  <div className="w-full flex flex-col gap-4">
    {/* Avatar + name row */}
    <div
      className="w-full rounded-2xl p-5 flex items-center gap-4"
      style={{ backgroundColor: '#141418' }}
    >
      {/* Avatar */}
      <SkeletonBlock width="w-16" height="h-16" rounded="rounded-full" />

      <div className="flex flex-col gap-2">
        {/* Name */}
        <SkeletonBlock width="w-32" height="h-4" />
        {/* Username */}
        <SkeletonBlock width="w-24" height="h-3" />
        {/* KYC badge */}
        <SkeletonBlock width="w-20" height="h-5" rounded="rounded-full" />
      </div>
    </div>

    {/* Referral card */}
    <div
      className="w-full rounded-2xl p-5"
      style={{ backgroundColor: '#141418' }}
    >
      <SkeletonBlock width="w-24" height="h-3" className="mb-3" />
      <SkeletonBlock width="w-full" height="h-10" rounded="rounded-xl" />
    </div>
  </div>
)