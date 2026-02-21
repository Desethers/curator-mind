import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const recentContext = messages.slice(-6)

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 80,
      system: `Based on this art advisory conversation, generate exactly 3 short suggestion chips.
Rules:
- Each chip must be 1-4 words maximum
- They should feel evocative and specific to what was discussed, not generic
- They should be conversation starters or continuations that feel natural
- Match the language of the conversation (French by default)
- Do NOT generate question chips — they should be statements or fragments the user might say
- Return ONLY a valid JSON array of exactly 3 strings, no other text
Example: ["matière brute", "montrez-moi une œuvre", "silence et vide"]`,
      messages: [
        {
          role: 'user',
          content: `Conversation récente: ${JSON.stringify(recentContext)}`,
        },
      ],
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'

    const chips = JSON.parse(text)
    if (Array.isArray(chips) && chips.length === 3) {
      return Response.json({ chips })
    }

    return Response.json({ chips: ['ce qui m\'attire', 'montrez-moi une œuvre', 'je veux en savoir plus'] })
  } catch {
    return Response.json({
      chips: ['ce qui m\'attire', 'montrez-moi une œuvre', 'je veux en savoir plus'],
    })
  }
}
