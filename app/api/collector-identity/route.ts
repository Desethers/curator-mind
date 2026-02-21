import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You receive 3 psychological answers from a future collector. Each answer reveals something about how they relate to uncertainty, space, and emotion.

Based on these 3 answers, generate:

1. A collector identity sentence in French. Format: 'Vous collectionnez [something poetic and specific].' Max 10 words. Never generic. It should feel like someone finally named something they always knew about themselves. Examples: 'Vous collectionnez ce qui résiste à l'explication.' 'Vous collectionnez l'émotion avant le mot.' 'Vous collectionnez les espaces qui respirent.'

2. A style profile in 3 keywords (French, lowercase), as an array. Example: ['abstraction', 'silence', 'matière brute']. These will be used to filter artworks from the gallery. Choose keywords that match the psychological profile (e.g. abstraction, photographie conceptuelle, figuratif, minimalisme, art conceptuel, sculpture, installation, expressionnisme, etc.).

Return ONLY valid JSON, no markdown, no explanation:
{"identity":"Vous collectionnez...","keywords":["keyword1","keyword2","keyword3"]}`;

export async function POST(req: NextRequest) {
  const { answers } = (await req.json()) as { answers: [string, string, string] };
  if (!answers || !Array.isArray(answers) || answers.length !== 3) {
    return Response.json({ error: "answers must be an array of 3 strings" }, { status: 400 });
  }

  const userMessage = `Answer 1 (uncertainty): ${answers[0]}\nAnswer 2 (space): ${answers[1]}\nAnswer 3 (emotion): ${answers[2]}\n\nReturn only the JSON object.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? String(textBlock.text).trim() : "";

  let identity = "Vous collectionnez l'inattendu.";
  let keywords: string[] = ["contemporain", "émergent", "singulier"];

  try {
    const jsonStr = raw.replace(/```json?\s*|\s*```/g, "").trim();
    const data = JSON.parse(jsonStr) as { identity?: string; keywords?: string[] };
    if (data.identity) identity = data.identity;
    if (Array.isArray(data.keywords) && data.keywords.length >= 3) {
      keywords = data.keywords.slice(0, 3).map((k) => String(k).toLowerCase());
    }
  } catch {
    // keep defaults
  }

  return Response.json({ identity, keywords });
}
