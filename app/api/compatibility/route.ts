import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { COMPATIBILITY_PROMPT } from '@/lib/prompts'
import { z } from 'zod'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  headers: {
    'HTTP-Referer': 'https://creailtuobot.com',
    'X-Title': 'creailtuobot',
  },
})

const MODEL = 'google/gemini-3.1-flash-lite'

// In-memory rate limiter (resets on cold start — fine for personal site)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

const bodySchema = z.object({
  name: z.string().min(1).max(50),
  trait: z.string().min(1).max(100),
  looking_for: z.string().min(1).max(100),
})

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  let parsed: z.infer<typeof bodySchema>
  try {
    const body = await req.json()
    parsed = bodySchema.parse(body)
  } catch {
    return new Response('Invalid input', { status: 400 })
  }

  const prompt = COMPATIBILITY_PROMPT.replaceAll('{name}', parsed.name)
    .replaceAll('{trait}', parsed.trait)
    .replaceAll('{looking_for}', parsed.looking_for)

  try {
    const result = streamText({
      model: openrouter(MODEL),
      prompt,
      maxOutputTokens: 600,
    })

    return result.toTextStreamResponse()
  } catch {
    return new Response('AI service error', { status: 502 })
  }
}
