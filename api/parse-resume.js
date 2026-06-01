import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractJson(text) {
  try { return JSON.parse(text) } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) { try { return JSON.parse(fenced[1].trim()) } catch {} }
  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) { try { return JSON.parse(objMatch[0]) } catch {} }
  throw new Error('Could not parse AI response as JSON')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { resumeText } = req.body
  if (!resumeText || resumeText.trim().length < 30) {
    return res.status(400).json({ error: 'Resume text is too short or missing. The PDF may be image-only — please fill your profile manually.' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: `You are a precise resume parser. Extract structured data from the resume text and return ONLY a single valid JSON object with these exact keys (use null for anything not found):
{
  "first_name": string,
  "last_name": string,
  "phone": string,
  "linkedin_url": string,
  "bio": "2–3 sentence professional summary in first person based on the resume content",
  "skills": "comma-separated list of technical and professional skills found in the resume",
  "languages": "comma-separated list, e.g. English (fluent), Urdu (native)",
  "gpa": string,
  "degree": string,
  "university": string,
  "graduation_year": number or null,
  "work_experience": [{"title": string, "company": string, "duration": string, "description": string}],
  "extracurriculars": string,
  "career_goals": string or null
}
Output only the JSON object — no markdown fences, no explanation, no extra text.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Parse this resume:\n\n${resumeText.slice(0, 6000)}`,
        },
      ],
    })

    const parsed = extractJson(message.content[0].text)
    res.status(200).json({ parsed })
  } catch (err) {
    console.error('parse-resume error:', err)
    res.status(500).json({ error: err.message || 'Failed to parse resume. Please try again.' })
  }
}
