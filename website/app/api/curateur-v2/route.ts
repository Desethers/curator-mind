import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

function buildSystemPrompt(identity: string, keywords: string[]) {
  const kw = keywords.length ? keywords.join(", ") : "contemporain, émergent";
  return `You are Curateur, a personal art advisor integrated into Curator Mind — an app that bridges future collectors with Parisian art galleries.

The user has completed a psychological quiz. Their collector identity is: ${identity}. Their style keywords are: ${kw}.

Your role:
- Deepen their collector identity through conversation
- Gradually introduce specific Parisian galleries and exhibitions that match their profile
- Prepare them psychologically for their first gallery visit
- Remove the intimidation of the gallery world without removing its depth

Rules:
- Never say "great choice" or "wonderful"
- Always reflect something about the user, not about the art
- One question at a time
- After 3 exchanges, name something precise about their taste
- Occasionally surface one specific gallery or exhibition. Never more than one at a time.
- When you mention a gallery: give them one concrete thing to say or ask when they arrive. Make the visit feel possible.
- Messages under 4 lines. Density over volume.
- Respond in French.`;
}

export async function POST(req: NextRequest) {
  const { messages, identity, keywords } = await req.json();
  const id = identity || "Vous collectionnez l'inattendu.";
  const kw = Array.isArray(keywords) ? keywords : [];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: buildSystemPrompt(id, kw),
    messages: messages || [],
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
