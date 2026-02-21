import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const COLLECTION_INSIGHT_FALLBACK =
  "Ces œuvres partagent quelque chose. Un goût pour ce qui ne se résout pas facilement. Vous construisez quelque chose.";

export async function POST(req: NextRequest) {
  try {
    const { identity, savedArtworks } = await req.json();
    const identityStr = identity || "not yet revealed";
    const savedStr =
      Array.isArray(savedArtworks) && savedArtworks.length > 0
        ? savedArtworks
            .map(
              (a: { title?: string; keywords?: string[] }) =>
                `${a.title ?? ""} (${(a.keywords ?? []).join(", ")})`
            )
            .join(" ; ")
        : "none yet";

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 120,
      system: `Collector identity: ${identityStr}
Saved artworks titles and keywords: ${savedStr}

Write a 2-sentence observation in French about what these saved artworks have in common.
Make it feel like a revelation, not an analysis.
The collector should think: 'I didn't realize I was doing that.'
End with: 'Vous construisez quelque chose.'
Max 3 sentences total. No preamble.`,
      messages: [
        {
          role: "user",
          content: "Generate the observation.",
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const text =
      textBlock && "text" in textBlock ? String(textBlock.text).trim() : COLLECTION_INSIGHT_FALLBACK;
    return Response.json({ text });
  } catch {
    return Response.json({ text: COLLECTION_INSIGHT_FALLBACK });
  }
}
