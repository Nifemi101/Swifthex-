//  /miniapp/me 
export interface User {
  chat_id: string
  username: string
  first_name: string
  kyc_verified: boolean
  kyc_level: number
  referral_code: string
}

//  /miniapp/wallets 
export interface Wallet {
  wallet_type: 'btc' | 'ethereum' | 'usdt' | 'naira'
  blockchain: string
  balance: number
  deposit_address: string
}

// /miniapp/transactions 
export type TransactionType = 'deposit' | 'withdrawal' | 'swap'
export type TransactionStatus = 'pending' | 'success' | 'failed'
export type WalletFilter = 'btc' | 'ethereum' | 'usdt' | 'naira' | ''

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  wallet_type: WalletFilter
  status: TransactionStatus
  created_at: string
  description?: string
}

export interface TransactionResponse {
  transactions: Transaction[]
  total_pages: number
  current_page: number
}

// /miniapp/rates 
export interface Rate {
  symbol: string
  buy: string
  sell: string
}

//  API generic wrapper 
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Groq AI Swap Advisor 
export interface SwapAdvisorResponse {
  recommendation: 'good' | 'wait' | 'neutral'
  message: string
}
export interface RatesResponse {
  rates: Rate[]
}

// --- Navigation ---
export type TabName = 'portfolio' | 'rates' | 'swap' | 'history' | 'profile'