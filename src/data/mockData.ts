import type { User, Wallet, Transaction, Rate } from "../types";

//  Mock User (/miniapp/me)
export const mockUser: User = {
  chat_id: "123456789",
  username: "swiftronaut",
  first_name: "Nifemi",
  kyc_verified: true,
  kyc_level: 2,
  referral_code: "SWIFT-NIF101",
};

//  Mock Wallets (/miniapp/wallets)
export const mockWallets: Wallet[] = [
  {
    wallet_type: "naira",
    blockchain: "fiat",
    balance: 250000.0,
    deposit_address: "",
  },
  {
    wallet_type: "usdt",
    blockchain: "TRC20",
    balance: 320.5,
    deposit_address: "TXyz1234abcd5678efgh9012ijkl3456mnop",
  },
  {
    wallet_type: "btc",
    blockchain: "Bitcoin",
    balance: 0.00412,
    deposit_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  {
    wallet_type: "ethereum",
    blockchain: "ERC20",
    balance: 0.215,
    deposit_address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
];

//  Mock Transactions (/miniapp/transactions)
export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "deposit",
    amount: 50000,
    wallet_type: "naira",
    status: "success",
    created_at: "2026-06-06T10:30:00Z",
    description: "Bank Transfer Deposit",
  },
  {
    id: "txn_002",
    type: "swap",
    amount: 100,
    wallet_type: "usdt",
    status: "success",
    created_at: "2026-06-05T14:20:00Z",
    description: "USDT to NGN",
  },
  {
    id: "txn_003",
    type: "withdrawal",
    amount: 20000,
    wallet_type: "naira",
    status: "pending",
    created_at: "2026-06-05T09:15:00Z",
    description: "Bank Withdrawal",
  },
  {
    id: "txn_004",
    type: "deposit",
    amount: 0.002,
    wallet_type: "btc",
    status: "success",
    created_at: "2026-06-04T18:45:00Z",
    description: "BTC Deposit",
  },
  {
    id: "txn_005",
    type: "withdrawal",
    amount: 150,
    wallet_type: "usdt",
    status: "failed",
    created_at: "2026-06-03T12:00:00Z",
    description: "USDT Withdrawal",
  },
  {
    id: "txn_006",
    type: "swap",
    amount: 0.001,
    wallet_type: "btc",
    status: "success",
    created_at: "2026-06-02T08:30:00Z",
    description: "BTC to USDT",
  },
];

//  Mock Rates (/miniapp/rates)
export const mockRates: Rate[] = [
  { symbol: "usdnaira", buy: "1348.00", sell: "1430.00" },
];
