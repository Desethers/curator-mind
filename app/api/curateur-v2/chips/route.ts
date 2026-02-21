import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    screen,
    entityName,
    entityType,
    identity,
    keywords,
    last2Messages,
  } = body as {
    screen: string;
    entityName?: string | null;
    entityType?: string | null;
    identity?: string | null;
    keywords?: string[];
    last2Messages?: { role: string; content: string }[];
  };

  const identityStr = identity || "not yet revealed";
  const kw = Array.isArray(keywords) ? keywords.join(", ") : "building...";
  const entityStr = entityName ? `${entityType ?? "entity"} "${entityName}"` : "nothing specific";
  const recentStr =
    Array.isArray(last2Messages) && last2Messages.length > 0
      ? last2Messages.map((m) => `${m.role}: ${m.content.slice(0, 80)}`).join(" | ")
      : "none";

  const system = `Generate exactly 3 short question chips in French. Max 6 words each.
Context: user is on ${screen} looking at ${entityStr}.
Their collector profile: ${identityStr} / ${kw}.
Recent conversation: ${recentStr}.

These chips should surface questions the user is probably thinking but hasn't asked. They should feel like thoughts, not menu items.

Return ONLY a JSON array of 3 strings, no other text:
["question 1", "question 2", "question 3"]`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 150,
    system,
    messages: [{ role: "user", content: "Generate the 3 chips." }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "[]";
  let chips: string[] = [];
  try {
    const parsed = JSON.parse(text.trim());
    chips = Array.isArray(parsed) ? parsed.slice(0, 3).filter((c) => typeof c === "string") : [];
  } catch {
    chips = [];
  }

  return Response.json({ chips });
}
