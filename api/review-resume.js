import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractJson(text) {
  try { return JSON.parse(text) } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()) } catch {}
  }
  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) } catch {}
  }
  throw new Error('Could not parse AI response as JSON')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { resumeText } = req.body
  if (!resumeText || resumeText.trim().length < 30) {
    return res.status(400).json({ error: 'Resume text is too short or missing.' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: [
        {
          type: 'text',
          text: `You are an expert resume reviewer. Analyze the resume text and return ONLY a valid JSON object with these keys:
{
  "overallImpression": string,
  "strengths": string,
  "areasForImprovement": string,
  "suggestions": string
}
Do not include markdown fences or extra commentary. Use concise actionable language.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Review this resume text and respond with the requested JSON only:\n\n${resumeText.slice(0, 6000)}`,
        },
      ],
    })

    const review = extractJson(message.content[0].text)
    res.status(200).json({ review })
  } catch (err) {
    console.error('review-resume error:', err)
    res.status(500).json({ error: err.message || 'Failed to review resume. Please try again.' })
  }
}
