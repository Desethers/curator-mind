import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    identity,
    lastSavedArtwork,
    lastTopic,
    daysSinceVisit,
  } = body as {
    identity?: string | null;
    lastSavedArtwork?: string | null;
    lastTopic?: string | null;
    daysSinceVisit?: number;
  };

  const identityStr = identity || "exploring";
  const savedStr = lastSavedArtwork || "none";
  const topicStr = lastTopic || "none";
  const daysStr = typeof daysSinceVisit === "number" ? String(daysSinceVisit) : "?";

  const system = `Generate a short push notification in French for a collector who:
- Has identity: ${identityStr}
- Last saved: ${savedStr}
- Last conversation topic: ${topicStr}
- Days since last visit: ${daysStr}

It should feel like a friend continuing a conversation. Not marketing. A genuine invitation to think. Max 2 sentences.

Examples:
'Vous avez sauvegardé Corps Céleste #3 il y a 5 jours. Vous y pensez encore ?'
'Perrotin ouvre une nouvelle série demain. Votre profil correspond exactement.'
'Trois semaines que vous explorez l'abstraction. Qu'est-ce que vous avez appris sur vous ?'

Return ONLY the notification text, no quotes or prefix.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 120,
    system,
    messages: [{ role: "user", content: "Generate the notification." }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

  return Response.json({ notification: text });
}
