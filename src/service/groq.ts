// ============================================================
// SwiftyEx TWA — Groq AI Service
// Calls go through /api/groq (Vercel proxy) to avoid CORS
// ============================================================

import axios from 'axios'
import type { Rate, SwapAdvisorResponse } from '../types'

const GROQ_MODEL = 'llama3-8b-8192'

// ============================================================
// Helper — sends request through Vercel proxy to Groq
// ============================================================
const askGroq = async (
  systemPrompt: string,
  userMessage: string
): Promise<string> => {
  const response = await axios.post('/api/groq', {
    model: GROQ_MODEL,
    max_tokens: 300,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  },
    ],
  })

  const content = response.data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from Groq')
  return content
}

// ============================================================
// Helper — strips markdown code blocks from Groq responses
// Groq sometimes wraps JSON in ```json ... ``` blocks
// ============================================================
const cleanJSON = (raw: string): string => {
  return raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()
}

// ============================================================
// Feature 1 — Swap Advisor
// Analyzes live rates and recommends whether to swap now
// ============================================================
export const getSwapAdvice = async (
  fromAsset: string,
  toAsset: string,
  rates: Rate[]
): Promise<SwapAdvisorResponse> => {
  const rateSummary = rates
    .map(r => `${r.symbol}: Buy ₦${r.buy}, Sell ₦${r.sell}`)
    .join('\n')

  const systemPrompt = `
    You are a concise crypto swap advisor for SwiftyEx, a Nigerian crypto exchange.
    Given the current market rates, tell the user if it is a good or bad time to swap.
    You MUST respond ONLY with a valid JSON object — no explanation, no markdown, no code blocks.
    The JSON must have exactly two fields:
    - "recommendation": one of "good", "wait", or "neutral"
    - "message": one short sentence (max 15 words) explaining why.
    Example: {"recommendation":"good","message":"Rates are at a 3-day high, good time to sell."}
  `

  const userMessage = `
    Current rates:
    ${rateSummary}
    The user wants to swap ${fromAsset} to ${toAsset}. Should they swap now?
  `

  try {
    const raw    = await askGroq(systemPrompt, userMessage)
    const clean  = cleanJSON(raw)
    const parsed = JSON.parse(clean) as SwapAdvisorResponse

    if (!parsed.recommendation || !parsed.message) {
      throw new Error('Invalid response shape from Groq')
    }

    return parsed
  } catch (err) {
    console.warn('getSwapAdvice failed:', err)
    return {
      recommendation: 'neutral',
      message: 'Unable to fetch advice right now. Proceed with caution.',
    }
  }
}

// ============================================================
// Feature 2 — Support Chat
// Answers user questions about SwiftyEx features
// ============================================================
export const getSupportReply = async (
  userMessage: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  const systemPrompt = `
    You are a helpful support assistant for SwiftyEx, a Nigerian crypto trading bot on Telegram.
    SwiftyEx allows users to: buy and sell crypto, swap tokens, check wallet balances,
    deposit and withdraw funds (NGN, BTC, USDT, ETH), refer friends, and access OTC trading.
    Answer questions clearly and briefly in 2-3 sentences max.
    If you cannot answer, say: "Please contact our support team on Telegram for further help."
    Never make up information about fees, rates, or policies.
  `

  try {
    const response = await axios.post('/api/groq', {
      model: GROQ_MODEL,
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: userMessage },
      ],
    })

    const content = response.data.choices?.[0]?.message?.content
    if (!content) throw new Error('Empty response from Groq')
    return content

  } catch (err) {
    console.warn('getSupportReply failed:', err)
    return 'Something went wrong. Please contact our support team on Telegram.'
  }
}