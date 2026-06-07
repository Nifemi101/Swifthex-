
import axios from 'axios'
import type { Rate, SwapAdvisorResponse } from '../types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama3-8b-8192'

// Groq API key from .env
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

// Axios instance for Groq
const groqClient = axios.create({
  baseURL: GROQ_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GROQ_API_KEY}`,
  },
  timeout: 15000,
})


// Helper — sends a message to Groq and returns the text reply

const askGroq = async (systemPrompt: string, userMessage: string): Promise<string> => {
  const response = await groqClient.post('', {
    model: GROQ_MODEL,
    max_tokens: 300,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })

  return response.data.choices[0]?.message?.content || ''
}


// Feature 1 — Swap Advisor
// Takes current rates and tells the user if it's a good time
// to swap. Returns a recommendation and a short message.

export const getSwapAdvice = async (
  fromAsset: string,
  toAsset: string,
  rates: Rate[]
): Promise<SwapAdvisorResponse> => {
  // Build a rate summary to send to Groq
 const rateSummary = rates
  .map((r) => `${r.symbol}: Buy ₦${r.buy}, Sell ₦${r.sell}`)
  .join('\n')

  const systemPrompt = `
    You are a concise crypto swap advisor for SwiftyEx, a Nigerian crypto exchange.
    Given the current market rates, tell the user if it is a good or bad time to swap.
    Always respond in valid JSON with exactly two fields:
    - "recommendation": one of "good", "wait", or "neutral"
    - "message": one short sentence (max 15 words) explaining why.
    Do not include any text outside the JSON object.
  `

  const userMessage = `
    Current rates:
    ${rateSummary}

    The user wants to swap ${fromAsset} to ${toAsset}.
    Should they swap now?
  `

  try {
    const raw = await askGroq(systemPrompt, userMessage)

    // Safely parse the JSON response from Groq
    const parsed = JSON.parse(raw) as SwapAdvisorResponse
    return parsed
  } catch {
    // Fallback if Groq fails or returns bad JSON
    return {
      recommendation: 'neutral',
      message: 'Unable to fetch advice right now. Proceed with caution.',
    }
  }
}


// Feature 2 — Support Chat
// Answers user questions about SwiftyEx features.
// Falls back to a Telegram redirect if it cannot help.

export const getSupportReply = async (
  userMessage: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  const systemPrompt = `
    You are a helpful support assistant for SwiftyEx, a Nigerian crypto trading bot on Telegram.
    SwiftyEx allows users to: buy and sell crypto, swap tokens, check wallet balances,
    deposit and withdraw funds (NGN, BTC, USDT, ETH), refer friends, and access OTC trading.
    Answer questions clearly and briefly (2-3 sentences max).
    If you cannot answer, say: "Please contact our support team on Telegram for further help."
    Never make up information about fees, rates, or policies.
  `

  // Include chat history for context-aware replies
  try {
    const response = await groqClient.post('', {
      model: GROQ_MODEL,
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: userMessage },
      ],
    })

    return response.data.choices[0]?.message?.content || 'Sorry, I could not process that. Please try again.'
  } catch {
    return 'Something went wrong. Please contact our support team on Telegram.'
  }
}