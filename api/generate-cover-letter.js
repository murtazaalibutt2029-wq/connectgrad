import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildProfileContext(name, profile, skills, motivation) {
  const workExpText = Array.isArray(profile?.work_experience) && profile.work_experience.length > 0
    ? profile.work_experience.map(w => `  - ${w.role} at ${w.company} (${w.duration})`).join('\n')
    : null

  return [
    `Name: ${name}`,
    profile?.university && profile.university !== 'Other' && `University: ${profile.university}`,
    profile?.field_of_study && `Degree: ${profile.field_of_study}`,
    profile?.graduation_year && `Graduation year: ${profile.graduation_year}`,
    profile?.gpa && `Academic achievements / GPA: ${profile.gpa}`,
    skills && `Skills: ${skills}`,
    profile?.bio && `About the applicant: ${profile.bio}`,
    profile?.career_goals && `Career goals: ${profile.career_goals}`,
    workExpText && `Work experience:\n${workExpText}`,
    profile?.extracurriculars && `Extracurricular activities: ${profile.extracurriculars}`,
    profile?.languages && `Languages spoken: ${profile.languages}`,
    profile?.why_abroad && `Why they want to work in this region: ${profile.why_abroad}`,
    motivation && `Why they want this specific role: ${motivation}`,
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { job, name, university, degree, motivation, skills, profile } = req.body

  if (!name || !job) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const city  = job.location.split(',')[0]
  const profileContext = buildProfileContext(name, profile, skills, motivation)
  const resolvedUni = (profile?.university && profile.university !== 'Other')
    ? profile.university
    : (university || '')
  const resolvedDegree = profile?.field_of_study || degree || ''

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: [
        {
          type: 'text',
          text: `You are an expert career coach writing outstanding cover letters for students applying to competitive roles.
Rules:
- Sound natural and human, not generic or template-like
- Be highly specific to the company, role, and the applicant's background
- 4 paragraphs, ~350 words
- British English spelling
- Use ALL available applicant information to personalise every paragraph
- Output ONLY the cover letter text — no commentary, no markdown, no "Here is your letter"
- Start directly with the sender's name on line 1`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Today's date: ${today}

APPLICANT PROFILE
${profileContext}

JOB
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Type: ${job.type}
Required skills: ${job.tags.join(', ')}
Description: ${job.description}

Write the letter in this exact format (use the real values, not placeholders):

${name}
${resolvedUni}${resolvedUni && resolvedDegree ? ' — ' : ''}${resolvedDegree}
${today}

Hiring Manager
${job.company}
${city}

Dear Hiring Manager,

Re: Application for ${job.title} — ${job.company}

[Opening paragraph]

[Second paragraph — motivation and fit, referencing their background]

[Third paragraph — skills and experience relevant to this role]

[Closing paragraph]

Yours sincerely,

${name}
${resolvedDegree}${resolvedDegree && resolvedUni ? ' — ' : ''}${resolvedUni}`,
        },
      ],
    })

    res.status(200).json({ letter: message.content[0].text })
  } catch (err) {
    console.error('Anthropic API error:', err)
    if (err.status === 401) return res.status(500).json({ error: 'Invalid API key.' })
    if (err.status === 429) return res.status(429).json({ error: 'Rate limit reached. Please try again.' })
    res.status(500).json({ error: 'Failed to generate cover letter. Please try again.' })
  }
}
