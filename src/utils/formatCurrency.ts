
/**
 * Format naira (NGN) amount with comma separators
 * e.g. 250000 → "₦250,000.00"
 */
export const formatNGN = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format USD amount
 * e.g. 320.5 → "$320.50"
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats BTC with up to 8 decimal places
 * e.g. 0.00412 → "0.00412000 BTC"
 */
export const formatBTC = (amount: number): string => {
  return `${amount.toFixed(8)} BTC`
}

/**
 * Formats USDT with 2 decimal places
 * e.g. 320.5 → "320.50 USDT"
 */
export const formatUSDT = (amount: number): string => {
  return `${amount.toFixed(2)} USDT`
}

/**
 * Formats ETH with up to 6 decimal places
 * e.g. 0.215 → "0.215000 ETH"
 */
export const formatETH = (amount: number): string => {
  return `${amount.toFixed(6)} ETH`
}

/**
 * Auto-detects wallet type and formats balance accordingly.
 * Used in WalletCard and TransactionItem components.
 */
export const formatBalance = (amount: number, walletType: string): string => {
  switch (walletType.toLowerCase()) {
    case 'naira':
      return formatNGN(amount)
    case 'usdt':
      return formatUSDT(amount)
    case 'btc':
      return formatBTC(amount)
    case 'ethereum':
      return formatETH(amount)
    default:
      return amount.toString()
  }
}

/**
 * Shortens a wallet deposit address for display
 * e.g. "bc1qxy2kg...h0wlh"
 */
export const shortenAddress = (address: string): string => {
  if (!address || address.length < 12) return address
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

/**
 * Formats a transaction date to a readable string
 * e.g. "2026-06-06T10:30:00Z" → "Jun 6, 10:30 AM"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}