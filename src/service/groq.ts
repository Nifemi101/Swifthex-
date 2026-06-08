// ============================================================
// SwiftyEx TWA — Groq AI Service
// Calls Groq API directly from the browser
// Groq supports CORS so no proxy needed
// ============================================================

import axios from 'axios'
import type { Rate, SwapAdvisorResponse } from '../types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL   = 'llama3-8b-8192'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

// ============================================================
// Helper — sends a message directly to Groq API
// ============================================================
const askGroq = async (
  systemPrompt: string,
  userMessage: string
): Promise<string> => {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      timeout: 15000,
    }
  )

  const content = response.data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from Groq')
  return content
}

// ============================================================
// Helper — strips markdown code blocks from Groq responses
// ============================================================
const cleanJSON = (raw: string): string => {
  return raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()
}

// ============================================================
// Feature 1 — Swap Advisor
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
    You MUST respond ONLY with a valid JSON object — no explanation, no markdown, no code blocks.
    The JSON must have exactly two fields:
    - "recommendation": one of "good", "wait", or "neutral"
    - "message": one short sentence (max 15 words) explaining why.
    Example: {"recommendation":"good","message":"Rates are at a 3-day high, good time to sell."}
  `

  const userMessage = `
    Current rates: ${rateSummary}
    The user wants to swap ${fromAsset} to ${toAsset}. Should they swap now?
  `

  try {
    const raw    = await askGroq(systemPrompt, userMessage)
    const clean  = cleanJSON(raw)
    const parsed = JSON.parse(clean) as SwapAdvisorResponse

    if (!parsed.recommendation || !parsed.message) {
      throw new Error('Invalid response shape')
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
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userMessage },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        timeout: 15000,
      }
    )

    const content = response.data.choices?.[0]?.message?.content
    if (!content) throw new Error('Empty response from Groq')
    return content

  } catch (err) {
    console.warn('getSupportReply failed:', err)
    return 'Something went wrong. Please contact our support team on Telegram.'
  }
}