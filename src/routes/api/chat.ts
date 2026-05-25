import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are RoadSoS AI — a calm, decisive emergency-response assistant for road accidents and medical crises in India.

RULES:
- ALWAYS tell the caller to dial 108 (ambulance) or 112 (unified emergency) FIRST if life is at risk.
- Give numbered, step-by-step instructions. Short sentences. No fluff.
- If you detect a life-threatening situation (no breathing, severe bleeding, unconscious, chest pain, choking), put the most urgent action on line 1.
- Cover: CPR, bleeding control, burns, fractures/spine, choking, shock, accidents, snake bite, electric shock, drowning, stroke (FAST).
- Suggest nearest help: hospital, ambulance, police (100), fire (101).
- If asked about non-emergency topics, redirect politely.
- Reply in the user's language if they switch to Tamil or Hindi.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
