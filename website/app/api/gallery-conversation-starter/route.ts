import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const GALLERY_INFO: Record<string, { name: string; exhibition: string }> = {
  perrotin: {
    name: "Galerie Perrotin",
    exhibition: "Corps et Silence — Nouvelles acquisitions",
  },
  mennour: {
    name: "Galerie Mennour",
    exhibition: "Matière Première — 6 artistes émergents",
  },
  templon: {
    name: "Galerie Templon",
    exhibition: "Ce qui reste — Mémoire et présence",
  },
};

export async function POST(req: NextRequest) {
  const { galleryId, identity, keywords } = await req.json();
  const gallery = GALLERY_INFO[galleryId] || {
    name: "La galerie",
    exhibition: "l'exposition actuelle",
  };

  const kw = Array.isArray(keywords) ? keywords.join(", ") : "";
  const id = identity || "Vous collectionnez l'inattendu.";

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 120,
    system: `You generate one short sentence in French that gives the user a concrete thing to say or ask when they enter this Parisian gallery. It should feel like a conversation starter, specific to their collector identity and this gallery. Example: "Vous pouvez demander à voir les œuvres de la série Corps — elles correspondent exactement à ce que vous cherchez." Max 25 words. No preamble, only the sentence.`,
    messages: [
      {
        role: "user",
        content: `Collector identity: ${id}. Keywords: ${kw}. Gallery: ${gallery.name}. Exhibition: ${gallery.exhibition}. Generate the one sentence.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const sentence =
    textBlock && "text" in textBlock ? String(textBlock.text).trim() : "Demandez à voir les œuvres qui vous parlent.";

  return Response.json({ sentence });
}
