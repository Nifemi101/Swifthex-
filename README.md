# SwiftyEx TWA — Telegram Web App Dashboard

A visual dashboard built as a Telegram Web App (TWA) for the SwiftyEx crypto trading bot. Built for the SwiftyEx Hackfest 2026, Track 1: Builders.

---

## The Problem

The SwiftyEx bot is a powerful crypto assistant that handles swaps, wallet balances, token trading, and utility bill payments entirely through text messages. While effective for quick commands, it creates friction for users who need to understand their financial standing at a glance. Stacked text messages make it difficult to parse portfolio data, track transaction history, or preview swap rates before executing.

---

## The Solution

The SwiftyEx TWA replaces the text-heavy bot interface with a visual command centre that lives inside Telegram. Users never leave the app — they tap the menu button next to the bot chat input, and the dashboard slides up as a full-screen overlay. All the data the bot provides through text is now rendered as a clean, interactive interface.

---

## Live Demo

**Web URL:** https://swifthex.vercel.app

**Bot:** https://t.me/SwiftyEx_bot

---

## Features

### Portfolio Overview
Displays the user's total portfolio value in NGN, calculated in real time by converting all wallet balances using live exchange rates. Each wallet — Naira, USDT, Bitcoin, and Ethereum — is shown as an individual card with its balance formatted in the correct denomination. A balance visibility toggle allows users to hide their figures with a single tap.

### Live Market Rates
Fetches real buy and sell rates from the SwiftyEx API every 30 seconds automatically. Users can also trigger a manual refresh. The timestamp of the last successful fetch is displayed so users always know how current the data is.

### Visual Swap Interface
Replaces the syntax-heavy swap commands with a clean form. Users select a FROM and TO token, enter an amount, and instantly see the estimated output calculated from live rates. All token pair combinations are supported through a universal cross-rate calculation that routes through USD as an intermediate value. The swap is executed by redirecting the user to the SwiftyEx bot to complete the transaction.

### Transaction History
A scrollable, paginated ledger of all past transactions. Users can filter by wallet type — Naira, USDT, BTC, or ETH — and load more records on demand. Each transaction shows its type, description, date, amount, and a colour-coded status badge for Success, Pending, or Failed.

### Profile
Displays the user's real Telegram name and username pulled directly from the Telegram SDK. Shows KYC verification status and level from the API. Includes a personalised referral code generated from the user's first name and Telegram ID in the format `SWIFT-[3 letters][3 digits]`. The referral code can be copied to clipboard with one tap.

### Customer Support
Tapping Customer Support redirects the user to the SwiftyEx bot directly, where they can reach the support team.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Telegram Bridge | @twa-dev/sdk |
| HTTP Client | Axios |
| Icons | Hugeicons Free |
| Deployment | Vercel |

---

## API Integration

The app connects to the SwiftyEx staging API at `https://bot.cordialexchange.com`.

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/miniapp/me` | POST | initData | Fetch user profile |
| `/miniapp/wallets` | POST | initData | Fetch all wallet balances |
| `/miniapp/transactions` | POST | initData | Fetch paginated transaction history |
| `/miniapp/rates` | GET | None | Fetch live buy/sell rates |

Authentication is handled by passing the Telegram `initData` string in the POST body. This string is provided automatically by the Telegram SDK when the app is opened inside Telegram and is used by the server to verify the user's identity.

When the API is unavailable or returns a 401, the app falls back to mock data seamlessly so the UI always renders correctly.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

To test inside Telegram during development, expose the local server using ngrok:

```bash
ngrok http 5173
```

Then update the menu button URL in BotFather with the ngrok HTTPS URL.

---

## Deployment

The app is deployed on Vercel connected to the GitHub repository. Every push to the main branch triggers an automatic redeployment.

---

## How the Telegram Integration Works

When a user opens the SwiftyEx bot and taps the menu button, Telegram loads the TWA URL inside a WebView overlay. The Telegram SDK is initialised before React renders, capturing the user's `first_name`, `username`, and `id` from `WebApp.initDataUnsafe.user`. These values are used to personalise the greeting, profile screen, and referral code without needing an API call.

Bot actions are triggered using `WebApp.openTelegramLink()` which closes the TWA and redirects the user to the specified bot URL, allowing the bot to handle deposit, withdraw, and swap execution natively.

---

## Author

**Adekogbe Nifemi**
GitHub: https://github.com/Nifemi101/Swifthex-