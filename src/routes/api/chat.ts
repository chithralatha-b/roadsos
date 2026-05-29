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

// Hard payload limits to prevent quota abuse
const MAX_MESSAGES = 20;
const MAX_TEXT_CHARS_PER_MSG = 2000;
const MAX_TOTAL_CHARS = 12000;
const MAX_BODY_BYTES = 64 * 1024; // 64 KB

function textOf(m: UIMessage): string {
  return (m.parts ?? [])
    .map((p: any) => (p?.type === "text" && typeof p.text === "string" ? p.text : ""))
    .join("");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        // Enforce body size
        const lenHeader = request.headers.get("content-length");
        if (lenHeader && Number(lenHeader) > MAX_BODY_BYTES) {
          return new Response("Payload too large", { status: 413 });
        }
        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return new Response("Payload too large", { status: 413 });
        }

        let body: { messages?: UIMessage[] };
        try { body = JSON.parse(raw); } catch { return new Response("Invalid JSON", { status: 400 }); }
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }
        if (messages.length > MAX_MESSAGES) {
          return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 413 });
        }
        let total = 0;
        for (const m of messages) {
          const t = textOf(m);
          if (t.length > MAX_TEXT_CHARS_PER_MSG) {
            return new Response(`Message too long (max ${MAX_TEXT_CHARS_PER_MSG} chars)`, { status: 413 });
          }
          total += t.length;
        }
        if (total > MAX_TOTAL_CHARS) {
          return new Response(`Conversation too long (max ${MAX_TOTAL_CHARS} chars)`, { status: 413 });
        }

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
