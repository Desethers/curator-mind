import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { lastUserMessage, lastAssistantMessage, existingMemory } = body as {
    lastUserMessage?: string;
    lastAssistantMessage?: string;
    existingMemory?: { keyInsights?: string[]; collectorMilestones?: string[] };
  };

  const existingInsights = Array.isArray(existingMemory?.keyInsights)
    ? existingMemory.keyInsights.join(" ; ")
    : "none";
  const existingMilestones = Array.isArray(existingMemory?.collectorMilestones)
    ? existingMemory.collectorMilestones.join(" ; ")
    : "none";

  const system = `From this conversation exchange, extract any new insight about this collector.
Current memory (key insights): ${existingInsights}
Current milestones: ${existingMilestones}

Return ONLY JSON — add only NEW insights, do not repeat existing ones:
{"newInsight": "string or null", "newMilestone": "string or null"}

Example insights: 'Hésite toujours sur le prix', 'Attirée par les œuvres qui posent des questions', 'Peur d'entrer dans les galeries', 'Budget réel autour de 2 000€'
Example milestones: 'A formulé sa première question sur un artiste', 'A admis vouloir acheter', 'Prêt pour une première visite galerie'`;

  const userContent = `User: ${lastUserMessage ?? ""}\nAssistant: ${lastAssistantMessage ?? ""}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system,
    messages: [{ role: "user", content: userContent }],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "{}";
  let result: { newInsight: string | null; newMilestone: string | null } = {
    newInsight: null,
    newMilestone: null,
  };
  try {
    const parsed = JSON.parse(text.trim());
    result = {
      newInsight:
        typeof parsed.newInsight === "string" && parsed.newInsight
          ? parsed.newInsight
          : null,
      newMilestone:
        typeof parsed.newMilestone === "string" && parsed.newMilestone
          ? parsed.newMilestone
          : null,
    };
  } catch {
    // keep default
  }

  return Response.json(result);
}
