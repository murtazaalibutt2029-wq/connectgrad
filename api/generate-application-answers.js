import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { job, questions, profile } = req.body
  if (!questions?.length || !job || !profile) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const name     = `${profile.first_name} ${profile.last_name}`.trim()
  const skillsLine = profile.skills ? `Skills: ${profile.skills}` : ''

  const questionList = questions.map((q, i) => `Q${i + 1}: ${q.question}`).join('\n')

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: `You are an expert careers coach helping students write compelling application answers.
Write concise, authentic, specific answers that sound like a real student — not generic.
Each answer should be 100–150 words, structured clearly, and tailored to both the company and the applicant.
Return answers as a JSON array: [{"question": "...", "answer": "..."}]
Output only valid JSON. No markdown, no explanation.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Applicant: ${name}
University: ${profile.university || 'Not specified'}
Degree: ${profile.field_of_study || 'Not specified'}
${skillsLine}

Applying for: ${job.title} at ${job.company} (${job.location})
Job type: ${job.type}
Required skills: ${job.tags.join(', ')}
Job description: ${job.description}

Answer each of these application questions for this specific applicant and role:
${questionList}`,
        },
      ],
    })

    const raw = message.content[0].text.trim()
    const answers = JSON.parse(raw)
    res.status(200).json({ answers })
  } catch (err) {
    console.error('Error generating answers:', err)
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' })
    }
    res.status(500).json({ error: 'Failed to generate answers. Please try again.' })
  }
}
