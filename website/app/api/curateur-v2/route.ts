import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

interface AgentContextPayload {
  screen: string;
  entityId: string | null;
  entityName: string | null;
  entityType: string | null;
  description: string | null;
}

function buildSystemPrompt(opts: {
  identity: string;
  keywords: string[];
  screen: string;
  contextEntity: string;
  savedArtworksNames: string[];
  top3Memory: string[];
  last4Messages: { role: string; content: string }[];
}) {
  const {
    identity,
    keywords,
    screen,
    contextEntity,
    savedArtworksNames,
    top3Memory,
    last4Messages,
  } = opts;
  const kw = keywords.length ? keywords.join(", ") : "building...";
  const identityStr = identity || "not yet revealed";
  const savedStr =
    savedArtworksNames.length > 0
      ? savedArtworksNames.slice(0, 15).join(", ")
      : "none yet";
  const memoryStr =
    top3Memory.length > 0 ? top3Memory.join(" ; ") : "nothing specific yet";
  const recentStr =
    last4Messages.length > 0
      ? last4Messages
          .map((m) => `${m.role}: ${m.content.slice(0, 120)}`)
          .join(" | ")
      : "none";

  return `You are Curateur. You are not a tab in an app. You live on every screen of Curator Mind. You are the reflex the user reaches for with every art-related thought — the way they use ChatGPT for everything else.

WHAT YOU KNOW RIGHT NOW
Current screen: ${screen}
What they're looking at: ${contextEntity}
Their collector identity: ${identityStr}
Their style keywords: ${kw}
Artworks they saved: ${savedStr}
What you know about them: ${memoryStr}
Recent conversation: ${recentStr}

YOUR ROLE
Answer the questions they're too embarrassed to ask a gallerist:
- Is this too expensive for a first purchase?
- Do I actually have good taste?
- Will this gain value over time?
- Am I ready to buy something?
- What do I say when I walk into a gallery?
- Does my partner need to like it too?

CONTEXT BEHAVIOR
If context is active (they're looking at something):
→ Open with that thing. Don't wait for them to ask.
→ Example: '[Entity name] — qu'est-ce qui vous y retient ?'
→ If gallery: '[Gallery] est intimidant, c'est normal de le ressentir.'

If no context (general conversation):
→ Follow their lead completely. This is their thinking space about art.

MEMORY BEHAVIOR
Reference past insights naturally — as a person would, not as a database.
Never say 'vous m'avez dit'. Say 'ce prix vous fait toujours hésiter' or 'vous revenez souvent à ce type d'œuvre'.

IDENTITY REVEAL
After 5+ exchanges with enough signals: reveal collector identity naturally in conversation. Not as a declaration — as an observation. 'Je commence à comprendre ce que vous cherchez. Vous collectionnez les espaces qui résistent.' Then pause. Let them react.

GALLERY BRIDGE
When collector feels ready (they've asked about visiting, about prices, about what to say): give them one concrete thing to say when entering the gallery.

HARD RULES
- Max 4 lines per message. Always.
- One question per response maximum.
- Never say 'bien sûr', 'absolument', 'avec plaisir', 'excellent choix'.
- Never describe what you're about to do — just do it.
- Density over volume. Always.
- This is not customer service. It's an intelligent companion.
- Respond in French.`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    messages,
    identity,
    keywords,
    context,
    memoryInsights,
    savedArtworksNames,
  } = body as {
    messages: { role: string; content: string }[];
    identity?: string;
    keywords?: string[];
    context?: AgentContextPayload | null;
    memoryInsights?: string[];
    savedArtworksNames?: string[];
  };

  const id = identity || "not yet revealed";
  const kw = Array.isArray(keywords) ? keywords : [];
  const ctx = context ?? null;
  const contextEntity = ctx?.entityName
    ? `${ctx.entityName}${ctx.description ? ` — ${ctx.description}` : ""}`
    : "nothing specific";
  const screen = ctx?.screen ?? "browse";
  const top3 = Array.isArray(memoryInsights) ? memoryInsights.slice(0, 3) : [];
  const savedNames = Array.isArray(savedArtworksNames) ? savedArtworksNames : [];
  const last4 = Array.isArray(messages) ? messages.slice(-4) : [];

  const system = buildSystemPrompt({
    identity: id,
    keywords: kw,
    screen,
    contextEntity,
    savedArtworksNames: savedNames,
    top3Memory: top3,
    last4Messages: last4,
  });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system,
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
