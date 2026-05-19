import { CHAT_PROMPT } from '@/lib/prompts'
import { z } from 'zod'

const MODEL = 'google/gemini-3.1-flash-lite'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 20) return true
  entry.count++
  return false
}

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(1000),
})

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(10),
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

  const messages = [
    { role: 'system', content: CHAT_PROMPT },
    ...parsed.messages,
  ]

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ''}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://creailtuobot.com',
        'X-Title': 'creailtuobot',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        max_tokens: 400,
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.text()
      console.error('[chat] upstream error:', upstream.status, err)
      return new Response('AI service error', { status: 502 })
    }

    // Parse SSE chunks from OpenRouter and forward as plain text
    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = upstream.body!.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() ?? ''
              for (const line of lines) {
                if (!line.startsWith('data: ')) continue
                const data = line.slice(6).trim()
                if (data === '[DONE]') continue
                try {
                  const chunk = JSON.parse(data)
                  const content = chunk.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content))
                  }
                } catch {
                  // skip malformed chunk
                }
              }
            }
          } finally {
            controller.close()
          }
        },
      }),
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  } catch {
    return new Response('AI service error', { status: 502 })
  }
}
