export default async function handler(req, res) {
  // Only allow POST requests
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