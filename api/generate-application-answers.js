import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildProfileContext(profile) {
  const workExpText = Array.isArray(profile?.work_experience) && profile.work_experience.length > 0
    ? profile.work_experience.map(w => `  - ${w.role} at ${w.company} (${w.duration})`).join('\n')
    : null

  return [
    profile?.university && profile.university !== 'Other' && `University: ${profile.university}`,
    profile?.field_of_study && `Degree: ${profile.field_of_study}`,
    profile?.graduation_year && `Graduation year: ${profile.graduation_year}`,
    profile?.gpa && `GPA / Achievements: ${profile.gpa}`,
    profile?.skills && `Skills: ${profile.skills}`,
    profile?.bio && `About them: ${profile.bio}`,
    profile?.career_goals && `Career goals: ${profile.career_goals}`,
    workExpText && `Work experience:\n${workExpText}`,
    profile?.extracurriculars && `Extracurriculars: ${profile.extracurriculars}`,
    profile?.languages && `Languages: ${profile.languages}`,
    profile?.why_abroad && `Why they want to work in this region: ${profile.why_abroad}`,
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { job, questions, profile } = req.body
  if (!questions?.length || !job || !profile) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  const questionList = questions.map((q, i) => `Q${i + 1}: ${q.question}`).join('\n')

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      system: [
        {
          type: 'text',
          text: `You are an expert careers coach helping students write compelling application answers.
Rules:
- Write concise, authentic, specific answers — 100–150 words each
- Reference concrete details from the applicant's background where relevant
- Tailor each answer to both the company and the applicant's specific profile
- Sound like a real person, not a template
- Return answers as a JSON array: [{"question": "...", "answer": "..."}]
- Output only valid JSON — no markdown, no explanation`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Applicant: ${name}
${buildProfileContext(profile)}

Applying for: ${job.title} at ${job.company} (${job.location})
Job type: ${job.type}
Required skills: ${job.tags.join(', ')}
Job description: ${job.description}

Answer each question for this specific applicant:
${questionList}`,
        },
      ],
    })

    const raw = message.content[0].text.trim()
    const answers = extractJsonArray(raw)
    res.status(200).json({ answers })
  } catch (err) {
    console.error('Error generating answers:', err)
    res.status(500).json({ error: err.message || 'Failed to generate answers. Please try again.' })
  }
}

function extractJsonArray(text) {
  // Direct parse first
  try { return JSON.parse(text) } catch {}

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()) } catch {}
  }

  // Extract the first [...] block from the text
  const arrayMatch = text.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]) } catch {}
  }

  throw new Error('Could not parse AI response. Please retry.')
}
