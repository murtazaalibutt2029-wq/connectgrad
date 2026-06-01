const FIELD_CONTEXT = {
  tech:      { tags: ['React','Python','Java','Node.js','Vue.js','TypeScript','PyTorch','Azure','SQL','Spring Boot','Figma'], phrase: 'technical problem-solving and software development' },
  finance:   { tags: ['Finance','Excel','Bloomberg','Investment'], phrase: 'financial analysis and quantitative reasoning' },
  design:    { tags: ['UX Research','Prototyping','UX'], phrase: 'user-centred design and creative problem-solving' },
  marketing: { tags: ['Marketing','Brand','FMCG'], phrase: 'brand strategy and consumer insight' },
  product:   { tags: ['Product','Strategy'], phrase: 'product thinking and cross-functional collaboration' },
}

function detectField(tags) {
  for (const [key, { tags: fieldTags }] of Object.entries(FIELD_CONTEXT)) {
    if (tags.some(t => fieldTags.includes(t))) return FIELD_CONTEXT[key].phrase
  }
  return 'analytical thinking and professional communication'
}

const ROLE_LABEL = {
  'Internship':    'internship',
  'Graduate Role': 'graduate position',
  'Full-time':     'role',
  'Part-time':     'part-time role',
}

const SKILL_CONNECTORS = {
  tech:      'giving me a practical understanding of how well-crafted software can solve real-world problems',
  finance:   'giving me a rigorous grounding in the analytical skills that underpin strong financial decision-making',
  design:    'teaching me to balance user needs with business objectives in every design decision',
  marketing: 'sharpening my ability to translate consumer insight into compelling brand narratives',
  product:   'developing my ability to align diverse teams around a clear product vision',
}

function getFieldKey(tags) {
  for (const [key, { tags: fieldTags }] of Object.entries(FIELD_CONTEXT)) {
    if (tags.some(t => fieldTags.includes(t))) return key
  }
  return null
}

export function generateCoverLetter({ job, name, university, degree, motivation }) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const fieldKey   = getFieldKey(job.tags)
  const fieldPhrase = detectField(job.tags)
  const skillConnector = fieldKey ? SKILL_CONNECTORS[fieldKey] : 'building a versatile skill set I am keen to apply professionally'
  const roleLabel  = ROLE_LABEL[job.type] || 'position'
  const skills     = job.tags.join(', ')
  const city       = job.location.split(',')[0]

  // Trim and lower-case the motivation for mid-sentence embedding
  const motivationTrimmed = motivation.trim().replace(/\.$/, '')
  const motivationLower   = motivationTrimmed.charAt(0).toLowerCase() + motivationTrimmed.slice(1)

  const motivationSentence = motivation.trim()
    ? `What draws me most to this role is ${motivationLower}. `
    : ''

  return `${name}
${university} — ${degree}
${today}

Hiring Manager
${job.company}
${city}

Dear Hiring Manager,

Re: Application for ${job.title} — ${job.company}

I am writing to express my strong interest in the ${roleLabel} of ${job.title} at ${job.company}. As a ${degree} student at ${university}, I have cultivated a solid foundation in ${fieldPhrase}, and I am eager to bring that expertise to a team with ${job.company}'s reputation for excellence.

${motivationSentence}${job.company} strikes me as an organisation where I can make a meaningful contribution from day one while continuing to grow. The scope of the role — particularly the focus on ${job.tags.slice(0, 2).join(' and ')} — aligns closely with both my academic background and the direction I want to take my career.

Through my studies and personal projects, I have developed hands-on experience with ${skills}, ${skillConnector}. I am a self-starter who thrives in collaborative, high-standards environments, and I take pride in producing work that is thoughtful, well-executed, and delivered on time.

Beyond the technical dimensions of this ${roleLabel}, I am genuinely excited by ${job.company}'s culture of continuous learning and the calibre of people I would be working alongside. I believe that great careers are built through great teams, and everything I have seen about ${job.company} suggests it is exactly that kind of environment.

Thank you for taking the time to consider my application. I would welcome the opportunity to discuss in further detail how my background, skills, and enthusiasm align with what you are looking for. I look forward to hearing from you.

Yours sincerely,

${name}
${degree} — ${university}`
}
