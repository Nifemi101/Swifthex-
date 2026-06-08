// ============================================================
// Vercel Serverless Function — Groq Proxy
// CommonJS format for maximum Vercel compatibility
// ============================================================

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify(req.body),
      }
    )

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    console.error('Groq proxy error:', err)
    return res.status(500).json({ error: 'Groq request failed' })
  }
}