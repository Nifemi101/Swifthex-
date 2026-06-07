import axios from 'axios'
import type {
  User,
  Wallet,
  TransactionResponse,
  Rate,
  WalletFilter,
  RatesResponse
} from '../types'

// Base URL pulled from .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bot.cordialexchange.com'

// Axios instance with shared config
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})


// initData Helper
// Returns empty string in dev (DEBUG bypass on the server),
// returns  Telegram initData when running inside Telegram.
const getInitData = (): string => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).Telegram?.WebApp?.initData || ''
  } catch {
    return ''
  }
}

// API Methods

/**
 * Fetches the authenticated user profile.
 * Endpoint: POST /miniapp/me
 * Returns: chat_id, username, first_name, kyc_verified, kyc_level, referral_code
 */
export const fetchUser = async (): Promise<User> => {
  const response = await client.post<User>('/miniapp/me', {
    initData: getInitData(),
  })
  return response.data
}

/**
 * Fetches all wallet balances and deposit addresses.
 * Endpoint: POST /miniapp/wallets
 * Returns: array of wallets (naira, usdt, btc, ethereum)
 */
export const fetchWallets = async (): Promise<Wallet[]> => {
  const response = await client.post<Wallet[]>('/miniapp/wallets', {
    initData: getInitData(),
  })
  return response.data
}

/**
 * Fetches paginated transaction history.
 * Endpoint: POST /miniapp/transactions
 * @param page - page number, default 1 (20 items per page)
 * @param wallet_type - filter by wallet or empty string for all
 */
export const fetchTransactions = async (
  page: number = 1,
  wallet_type: WalletFilter = ''
): Promise<TransactionResponse> => {
  const response = await client.post<TransactionResponse>(
    '/miniapp/transactions',
    {
      initData: getInitData(),
      page,
      wallet_type,
    }
  )
  return response.data
}

/**
 * Fetches current buy/sell rates for all assets.
 * Endpoint: GET /miniapp/rates
 * Public endpoint — no initData needed.
 */
export const fetchRates = async (): Promise<Rate[]> => {
  const response = await client.get<RatesResponse>('/miniapp/rates')
  return response.data.rates
}