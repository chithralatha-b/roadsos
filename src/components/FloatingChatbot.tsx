import { Bot, Send, X, Phone, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { telLink, EMERGENCY_NUMBERS } from "@/lib/offline";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const QUICK = ["I see severe bleeding", "Person not breathing", "Bike accident — what now?", "Burn on hand"];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "w", role: "assistant", text: "I'm RoadSoS AI. Describe the emergency — I'll guide you step-by-step. For life-threatening cases dial 108 first." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, open]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setBusy(true);
    const assistantId = `a-${Date.now()}`;
    setMsgs((m) => [...m, { id: assistantId, role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({
            id: m.id, role: m.role,
            parts: [{ type: "text", text: m.text }],
          })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`Chat failed (${res.status})`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const ln of lines) {
          if (!ln.startsWith("data: ")) continue;
          const payload = ln.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "text-delta" && typeof evt.delta === "string") {
              acc += evt.delta;
              setMsgs((m) => m.map((x) => (x.id === assistantId ? { ...x, text: acc } : x)));
            }
          } catch { /* ignore */ }
        }
      }
      if (!acc) {
        setMsgs((m) => m.map((x) => (x.id === assistantId ? { ...x, text: "I couldn't reach the AI. Call 108 immediately if this is life-threatening." } : x)));
      }
    } catch (e: any) {
      setMsgs((m) => m.map((x) => (x.id === assistantId ? { ...x, text: `Network issue. Call 108 now if urgent. (${e.message})` } : x)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-2xl bg-gradient-ai glow-blue flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Open AI assistant"
        >
          <div className="absolute inset-0 rounded-2xl bg-ai/40 animate-ripple" />
          <Bot className="relative h-6 w-6 text-white" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass-strong rounded-t-3xl flex flex-col animate-fade-up" style={{ height: "82vh" }}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <div className="h-10 w-10 rounded-xl bg-gradient-ai glow-blue flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">RoadSoS AI Assistant</p>
                <p className="text-[11px] text-success">● Live · Multilingual</p>
              </div>
              <a href={telLink(EMERGENCY_NUMBERS.ambulance)} className="h-9 px-3 rounded-xl bg-emergency text-white text-xs font-bold flex items-center gap-1.5 glow-red">
                <Phone className="h-3.5 w-3.5" /> 108
              </a>
              <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-xl glass flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 text-sm whitespace-pre-wrap rounded-2xl ${m.role === "user" ? "bg-gradient-ai text-white rounded-br-md" : "glass rounded-bl-md"}`}>
                    {m.text || <Loader2 className="h-4 w-4 animate-spin text-cyan-glow" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            {msgs.length <= 2 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="shrink-0 text-[11px] px-3 py-1.5 rounded-full glass border border-cyan-glow/30 text-cyan-glow">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2 glass rounded-2xl p-2">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Describe the emergency…"
                  className="flex-1 bg-transparent text-sm outline-none px-2"
                />
                <button onClick={() => send(input)} disabled={busy || !input.trim()} className="h-10 w-10 rounded-xl bg-emergency glow-red flex items-center justify-center disabled:opacity-40">
                  {busy ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Send className="h-4 w-4 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
