import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { job, name, university, degree, motivation } = req.body

  if (!name || !university || !degree || !job) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: `You are an expert career coach who writes outstanding cover letters for students and recent graduates applying for jobs.
Write professional, compelling, and authentic cover letters that:
- Sound natural and human, not generic or template-like
- Are tailored specifically to the company and role
- Highlight relevant skills without being boastful
- Are the right length (4 paragraphs, ~350 words)
- Use British English spelling
- Follow standard UK/international cover letter format
Output only the cover letter text itself — no commentary, no "Here is your cover letter:", no markdown. Start directly with the sender's details.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Write a professional cover letter for the following:

APPLICANT
Name: ${name}
University: ${university}
Degree: ${degree}
${motivation ? `Why they want this role: ${motivation}` : ''}

JOB
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Type: ${job.type}
Required skills: ${job.tags.join(', ')}
Job description: ${job.description}

Format the letter as:
[Full Name]
[University] — [Degree]
[Today's date]

Hiring Manager
[Company]
[City]

Dear Hiring Manager,

Re: Application for [Job Title] — [Company]

[Opening paragraph: express interest, mention degree and university]

[Second paragraph: connect their motivation and skills to this specific role and company]

[Third paragraph: relevant skills/experience for the specific requirements of this job]

[Closing paragraph: enthusiasm, call to action]

Yours sincerely,

[Full Name]
[Degree] — [University]`,
        },
      ],
    })

    const letter = message.content[0].text
    res.status(200).json({ letter })
  } catch (err) {
    console.error('Anthropic API error:', err)
    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY environment variable.' })
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please try again in a moment.' })
    }
    res.status(500).json({ error: 'Failed to generate cover letter. Please try again.' })
  }
}
