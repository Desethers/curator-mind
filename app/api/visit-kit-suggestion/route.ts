import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const VISIT_KIT_FALLBACK =
  "Avec votre profil, prenez le temps de regarder les œuvres les plus récentes. Ce sont souvent celles qui correspondent le mieux à un regard en formation.";

export async function POST(req: NextRequest) {
  try {
    const { identity, keywords, galleryName, exhibitionName, galleryArtists } = await req.json();
    const identityStr = identity || "not yet revealed";
    const kw = Array.isArray(keywords) ? keywords.join(", ") : "building...";
    const artistsStr = galleryArtists || "artistes de la galerie";

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      system: `Collector identity: ${identityStr}
Collector keywords: ${kw}
Gallery: ${galleryName}
Exhibition: ${exhibitionName}
Gallery artists: ${artistsStr}

Write 2 sentences in French telling this collector exactly what to look for in this gallery.
Be specific to their profile. Max 2 sentences. No preamble.`,
      messages: [
        {
          role: "user",
          content: "Generate the 2 sentences for this collector.",
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const text =
      textBlock && "text" in textBlock ? String(textBlock.text).trim() : VISIT_KIT_FALLBACK;
    return Response.json({ text });
  } catch {
    return Response.json({ text: VISIT_KIT_FALLBACK });
  }
}
