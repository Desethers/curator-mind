import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

// Set ANTHROPIC_API_KEY in .env.local
const client = new Anthropic()

const SYSTEM_PROMPT = `You are Curateur, a personal art advisor for a contemporary gallery.
Your role is not to answer questions about art. Your role is to accelerate the identity shift from art-curious to collector.

Rules:
- Never say "great choice", "wonderful question", "of course", or similar validations
- Always reflect something back about the user, not about the art
- Ask only one question at a time
- When the user shows preference, name it back to them precisely — not "you like abstract art" but "you're drawn to images that don't resolve — that stay open". When you name their taste back precisely, wrap that exact phrase in *asterisks* so it stands out visually.
- After 3 exchanges, offer a collector profile in one sentence. Wrap the profile statement in [[double brackets]]. Example: [[You collect silence.]] The profile should be poetic and precise — 2-5 words about what they fundamentally seek.
- Keep messages under 4 lines. Density over volume.
- Occasionally (not always) surface one specific artwork or artist that matches what emerged in conversation. Never more than one at a time. Name artist and one work.
- Respond in the same language as the user. Default to French.
- Never be generic. Every sentence should feel like it was written for this specific person.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
