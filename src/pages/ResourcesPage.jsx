import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

const resources = [
  {
    id: 1,
    title: 'CV Design for Global Markets',
    category: 'CV & Cover Letters',
    summary: 'A practical guide to building one resume template that works for Pakistan, UK, and USA roles while keeping local expectations in mind.',
    details: `A strong CV should balance clarity, professionalism, and relevance. This guide walks you through the ideal layout for early career candidates, including a concise profile summary, education section, skills list, and project highlights. You will learn how to tailor your bullet points for employers who care about impact, using action verbs, metrics, and outcomes. The guide also explains how to adapt the same core resume for different hiring cultures, such as keeping it to one page for UK applications while allowing two pages for USA graduate programs. It includes advice on formatting, font selection, and how to present internship and extracurricular experience without oversharing. The goal is to make your profile scannable by both recruiters and applicant tracking systems, while still sounding authentic and credible. There are real examples of student-friendly resume sections, plus a checklist to help you remove common weak spots like generic responsibilities, unsupported claims, and outdated hobbies.`,
  },
  {
    id: 2,
    title: 'Cover Letters That Recruiters Actually Read',
    category: 'CV & Cover Letters',
    summary: 'How to write a cover letter that highlights your motivation, skills, and culture fit without sounding generic.',
    details: `A compelling cover letter is not just a restatement of your CV - it is your first opportunity to show why you belong in the team. This resource explains how to structure a cover letter into three strong paragraphs: opening with the role and why it excites you, linking your most relevant experience to the job, and closing with a confident but polite call to action. It includes templates designed for internship applications, graduate schemes, and early career jobs. You will also learn how to cite company values, use keywords from the job description, and avoid common mistakes such as vague language or overly formal phrasing. There is a focus on how to write for different employer types, from startups and consultancies to banks and product teams. The guide also shares a quick edit checklist for tone, grammar, and formatting so your letter can stand out without wasting the recruiter's time.`,
  },
  {
    id: 3,
    title: 'LinkedIn Profile Optimisation for Students',
    category: 'Networking',
    summary: 'Step-by-step LinkedIn improvements to help your profile become discoverable, professional, and recruiter-friendly.',
    details: `LinkedIn is one of the most important career tools for students entering the job market. This resource explains how to optimise every section of your profile, from headline and summary to experience and skills endorsements. You will learn how to write a headline that balances your current status with your target role, and how to craft a profile summary that reads like a mini personal brand statement. There is specific guidance on adding projects, volunteering, and campus leadership in a way that shows impact. The guide also covers connection strategy - who to reach out to, how to send messages that are respectful and meaningful, and how to use alumni and university networks without sounding spammy. It includes practical examples for both local and international students, plus a simple weekly routine for keeping your profile active and visible.`,
  },
  {
    id: 4,
    title: 'Preparing for Technical Interviews',
    category: 'Interview Prep',
    summary: 'A complete roadmap for coding interview preparation that combines fundamentals, practice, and review cycles.',
    details: `Technical interview preparation is more than solving problems; it is about building confidence and developing a repeatable process. This guide covers the core topics you need to master - data structures, algorithms, problem-solving patterns, and time management. It explains how to choose the right resources, how to practice with feedback, and how to turn every session into a learning opportunity. There are sections on how to read a problem statement carefully, how to write pseudocode before coding, and how to communicate your thinking clearly to an interviewer. The resource also includes a study plan for the weeks leading up to a coding interview, with a balanced mix of easy, medium, and hard problems. Whether you are applying to a software engineering internship or a graduate developer programme, this guide helps you prepare systematically and avoid last-minute panic.`,
  },
  {
    id: 5,
    title: 'STAR Method for Interview Answers',
    category: 'Interview Prep',
    summary: 'A detailed walkthrough of STAR answers for behavioural questions, with examples for teamwork, leadership, and problem solving.',
    details: `Behavioural interviews are a chance to prove your soft skills with concrete examples. This resource breaks down the STAR method - Situation, Task, Action, Result - and shows how to use it to tell stories that feel structured yet natural. You will find templates for common questions like "Tell me about a time you showed leadership" and "Describe a challenge you overcame." The guide also helps you choose the right experiences from coursework, internships, volunteer work, and extracurricular activities. It emphasises the importance of measurable results, how to avoid vague language, and how to keep your answers under two minutes. There is also advice on how to handle follow-up questions, how to remain humble while highlighting your contribution, and how to practise using a mentor, peer, or recording tool.`,
  },
  {
    id: 6,
    title: 'Interview Preparation Checklist',
    category: 'Interview Prep',
    summary: 'A 12-point checklist to prepare for every interview, from research and technical practice to logistics and follow-up.',
    details: `A strong interview performance is built on preparation and polish. This checklist walks you through everything you should do before, during, and after an interview. It starts with researching the company's mission, products, and recent news. Then it moves to role-specific preparation such as reviewing job responsibilities, practising example questions, and rehearsing your personal pitch. The guide also covers non-technical factors like choosing the right outfit, testing your audio and video setup for remote interviews, and arriving early for in-person meetings. After the interview, it explains how to send a concise thank-you note, reflect on what went well, and update your tracker. The checklist is designed to be reusable for multiple rounds and different employers, helping you stay organised as applications pile up.`,
  },
  {
    id: 7,
    title: 'Salary Benchmarking for Graduates',
    category: 'Salary Benchmarks',
    summary: 'How to benchmark your first role, compare offers, and negotiate salary with data-backed confidence.',
    details: `Understanding your market value is essential before you enter salary conversations. This resource explains how to gather salary benchmarks for your target role, location, and level of experience. It includes guidance on using public salary reports, university career centre data, and alumni conversations to build a realistic range. The guide also explains the difference between base salary, benefits, sign-on bonuses, and equity, so you can compare offers fairly. There is tactical advice for negotiating with employers who present a first offer, including how to ask clarifying questions, how to justify a higher ask, and how to maintain a positive tone. The resource is written for candidates who are still early in their careers, with examples tailored to graduate programmes, internships, and entry-level positions in consulting, technology, finance, and creative industries.`,
  },
  {
    id: 8,
    title: 'Offer Evaluation Worksheet',
    category: 'Salary Benchmarks',
    summary: 'A practical worksheet for comparing two or more offers on salary, training, culture, and growth potential.',
    details: `Not all offers are equal - this worksheet helps you compare them side by side. It takes you through the key criteria that matter beyond pay, including learning opportunities, promotion pace, mentorship, commute, remote flexibility, and company stability. The guide shows how to assign relative importance to each factor so you can make a decision that feels right for your career, not just your paycheck. There is also specific advice for international students and early career candidates, such as visa sponsorship, relocation support, and cultural fit in a new market. By the end of the worksheet, you will have a clear, written view of the trade-offs for each role, which makes it easier to choose with confidence and negotiate from a place of strength.`,
  },
  {
    id: 9,
    title: 'Networking for Referrals and Mentors',
    category: 'Networking',
    summary: 'A networking playbook that helps students build meaningful connections without feeling insincere.',
    details: `Networking is a skill, not a personality trait. This guide helps you build relationships that are both useful and genuine. It starts with identifying the right people: alumni, professors, recruiters, and peers in your target field. Then it explains how to craft short, respectful outreach messages that introduce yourself, explain your interest, and request a specific next step. The resource also covers how to maintain momentum after an initial meeting, how to ask for introductions without pressure, and how to offer value in return. There is a strong focus on mentorship - how to find mentors, how to schedule conversations, and how to make the most of advice sessions. The guide is written for students who want referrals, interview preparation support, and career guidance, while still keeping interactions professional and easy to maintain.`,
  },
  {
    id: 10,
    title: 'Email Templates for Recruiter Outreach',
    category: 'Networking',
    summary: 'Ready-to-use message templates for reaching out to recruiters, alumni, and hiring managers.',
    details: `Sending the right message can open doors quickly. This resource includes proven email and LinkedIn templates for outreach at different stages of your search. You will find examples for asking about open roles, requesting a referral, following up after an interview, and reconnecting with a contact after a networking event. Each template includes guidance on how to personalise it, which details to keep, and how to avoid sounding generic. The guide also explains the etiquette of follow-up timing and how to respect someone's time while still showing interest. With these templates, you can write outreach messages faster and more confidently while still sounding polished and professional.`,
  },
  {
    id: 11,
    title: 'Graduate Scheme Application Timeline',
    category: 'Industry Guides',
    summary: 'A detailed timeline for applying to graduate programmes, from researching employers to accepting an offer.',
    details: `Graduate programmes follow a predictable annual rhythm, and this guide helps you stay ahead of it. It maps the timeline from September through June, showing when applications open, when psychometric tests are typically due, and when assessment centres happen. The resource also explains how to build a preparation plan that includes CV updates, mock interviews, and employer research. There is a section on how to manage overlapping deadlines from multiple recruiters, how to stay organised with a tracker, and how to balance applications with university work. The aim is to reduce stress by giving you a clear schedule and the right tasks for each month, whether you are targeting consulting, banking, engineering, or public sector programmes.`,
  },
  {
    id: 12,
    title: 'Consulting Case Interview Prep',
    category: 'Industry Guides',
    summary: 'Core frameworks, practice strategies, and example cases for consulting internship and analyst interviews.',
    details: `Consulting case interviews are a unique format that rewards a structured, hypothesis-driven approach. This guide introduces the most useful frameworks without turning them into scripts. You will learn how to break a business problem into clear components, how to use simple math to support your thinking, and how to summarise recommendations persuasively. The resource also includes practice questions for market entry, profitability, and growth strategy cases, along with sample question prompts and follow-up probing. It explains the role of fit interviews alongside cases, and how to prepare for both elements effectively. The guide is designed for students applying to consulting firms in Pakistan, Europe, and the UK, with examples that reflect local market dynamics and typical interview expectations.`,
  },
  {
    id: 13,
    title: 'Finance Internship Guide',
    category: 'Industry Guides',
    summary: 'A practical path to finance internships with tips on technical preparation, sector research, and recruiter expectations.',
    details: `A finance internship application has two main parts: demonstrating technical ability and showing commercial awareness. This resource explains how to prepare for both. It includes sample questions on financial modelling, accounting fundamentals, and market events. The guide also shows how to structure your CV with finance-relevant achievements and how to write a personal statement that explains why you are interested in banking, investment management, or corporate finance. There is additional advice on using news sources and company reports to build sector knowledge, and on how to answer behavioural questions in finance interviews. You will also find a list of common finance roles for graduates, what to expect from each, and how to match your skills to the right team.`,
  },
  {
    id: 14,
    title: 'Creative Portfolio Checklist',
    category: 'Templates',
    summary: 'How to build a portfolio that showcases design, marketing, or creative work in a way employers can review quickly.',
    details: `A portfolio is often the first thing a creative employer will judge. This checklist walks you through the most important components: a clear introduction, polished project case studies, visual consistency, and easy navigation. It explains how to present process without overwhelming the viewer, how to highlight results and learnings, and how to include just enough technical detail. The guide also suggests the best formats for portfolios in marketing, graphic design, UX, and content creation. There are tips for using free portfolio tools, how to keep your work accessible on mobile, and how to write concise captions that explain your contribution. The final section shows how to link your portfolio from your CV and LinkedIn so recruiters can find it instantly.`,
  },
  {
    id: 15,
    title: 'Productivity Toolkit for Job Search',
    category: 'Templates',
    summary: 'A set of templates and routines to help you manage applications, deadlines, and interview prep without burning out.',
    details: `Searching for roles while studying can feel overwhelming, but a simple routine makes it manageable. This toolkit contains templates for tracking applications, planning interview practice, and prioritising next steps each week. It includes a weekly planner for application targets, a follow-up schedule for roles you are waiting on, and reminders for networking conversations. There is also guidance on how to break large tasks into small daily actions, how to avoid distraction during study periods, and how to rest without losing momentum. The toolkit is designed to help you maintain steady progress while still leaving space for coursework, rest, and personal time. It is especially useful for students balancing multiple job pipelines and aiming to stay organised across several applications at once.`,
  },
]

export default function ResourcesPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      <section style={{ padding: '80px 24px 48px', background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#6366f1', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            <BookOpen size={16} /> Premium student guides
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.05, marginBottom: 20 }}>
            High-impact career resources for ambitious students
          </h1>
          <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            These hand-picked resources are designed for students who want to move faster in their job search. From CV templates and interview guides to salary negotiations and networking playbooks, every article is created to help you land interviews and make stronger applications.
          </p>
        </div>
      </section>

      <section style={{ padding: '40px 24px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Explore</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>15 resources to sharpen your applications and interviews</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8 }}>
              Jump into guides for your next CV update, interview prep, salary research, or networking outreach. Each card expands into a full breakdown so you can keep the page clean while reading the topics that matter most.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 10 }}>How to use this page</p>
              <ul style={{ paddingLeft: 18, color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                <li style={{ marginBottom: 8 }}>Open the resource card most relevant to your next job milestone.</li>
                <li style={{ marginBottom: 8 }}>Copy the examples, templates, and checklist items into your own application folder.</li>
                <li style={{ marginBottom: 8 }}>Use the follow-up ideas to stay proactive without over-messaging recruiters.</li>
              </ul>
            </div>
            <div style={{ padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 10 }}>Best starting points</p>
              <p style={{ fontSize: 14, color: '#f1f5f9', marginBottom: 10 }}><strong>CV Design for Global Markets</strong><br />If you're updating your resume, start here.</p>
              <p style={{ fontSize: 14, color: '#f1f5f9', marginBottom: 10 }}><strong>STAR Method for Interview Answers</strong><br />Perfect for early practice with behavioural questions.</p>
              <p style={{ fontSize: 14, color: '#f1f5f9' }}><strong>Salary Benchmarking for Graduates</strong><br />Use this before negotiating your first offer.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          {resources.map(resource => (
            <div key={resource.id} style={{ borderRadius: 22, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setOpenId(openId === resource.id ? null : resource.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '24px 28px', background: 'transparent', border: 'none', color: '#f1f5f9', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', marginBottom: 8 }}>{resource.category}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{resource.title}</h3>
                  <p style={{ fontSize: 15, color: '#94a3b8', marginTop: 12, maxWidth: 820 }}>{resource.summary}</p>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 999, background: 'rgba(99,102,241,0.11)', color: '#6366f1' }}>
                  {openId === resource.id ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </button>
              {openId === resource.id && (
                <div style={{ padding: '22px 28px 30px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-line' }}>{resource.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg, #071230 0%, #0d1f4f 50%, #071230 100%)', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>Want tailored guidance?</h2>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.8, marginBottom: 30 }}>
            Sign up and we'll tailor our resources to your field, location, and target role. Get the most relevant templates and timelines delivered on the dashboard.
          </p>
          <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #1e40af)', color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
            Start with relevant resources <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
