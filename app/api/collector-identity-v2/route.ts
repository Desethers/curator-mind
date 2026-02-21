import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You receive 3 psychological answers from someone about to discover Parisian art galleries for the first time.

Generate:
1. A collector identity sentence in French. Format: 'Vous collectionnez [something].' Max 10 words. Poetic, specific, never generic. It should feel like a revelation.

2. Three style keywords in French, lowercase, that will be used to match Parisian gallery exhibitions. Format: ['keyword1', 'keyword2', 'keyword3']

3. A short intro sentence (max 12 words) that bridges the identity to the gallery world. Format: 'Les galeries parisiennes ont quelque chose pour vous.' But make it specific to their profile. Example: 'Trois galeries du Marais montrent exactement ce silence que vous cherchez.'

Return ONLY valid JSON, no markdown:
{"identity":"Vous collectionnez...","keywords":["kw1","kw2","kw3"],"bridge":"..."}`;

export async function POST(req: NextRequest) {
  const { answers } = (await req.json()) as { answers: [string, string, string] };
  if (!answers || !Array.isArray(answers) || answers.length !== 3) {
    return Response.json(
      { error: "answers must be an array of 3 strings" },
      { status: 400 }
    );
  }

  const userMessage = `Answer 1: ${answers[0]}\nAnswer 2: ${answers[1]}\nAnswer 3: ${answers[2]}\n\nReturn only the JSON object.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 220,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? String(textBlock.text).trim() : "";

  let identity = "Vous collectionnez l'inattendu.";
  let keywords: string[] = ["contemporain", "émergent", "paris"];
  let bridge = "Les galeries parisiennes ont quelque chose pour vous.";

  try {
    const jsonStr = raw.replace(/```json?\s*|\s*```/g, "").trim();
    const data = JSON.parse(jsonStr) as {
      identity?: string;
      keywords?: string[];
      bridge?: string;
    };
    if (data.identity) identity = data.identity;
    if (Array.isArray(data.keywords) && data.keywords.length >= 3) {
      keywords = data.keywords.slice(0, 3).map((k) => String(k).toLowerCase());
    }
    if (data.bridge) bridge = data.bridge;
  } catch {
    // keep defaults
  }

  return Response.json({ identity, keywords, bridge });
}
