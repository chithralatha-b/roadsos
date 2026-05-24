import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Bot, Mic, Send, Heart, Droplet, Activity, Phone } from "lucide-react";
import { useState } from "react";
import { searchFirstAid, FIRST_AID_KB, EMERGENCY_NUMBERS, telLink } from "@/lib/offline";

export const Route = createFileRoute("/assistant")({ component: Assistant });

const suggestions = [
  { icon: Heart, label: "Check breathing", q: "not breathing" },
  { icon: Droplet, label: "Stop bleeding", q: "severe bleeding" },
  { icon: Activity, label: "Start CPR", q: "cpr" },
  { icon: Phone, label: "Call 108", q: "__call__" },
];

type Msg = { role: "ai" | "user"; text: string };

function answer(query: string): string {
  if (/\b(108|112|ambulance|emergency number)\b/i.test(query)) {
    return `Call 108 for ambulance or 112 for unified emergency. Tap the phone icon below to dial directly.`;
  }
  const entry = searchFirstAid(query);
  if (entry) {
    return `**${entry.title}**\n\n${entry.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
  }
  const topics = FIRST_AID_KB.map((e) => e.title).join(", ");
  return `I'm RoadSoS AI — working offline. I can help with: ${topics}. Describe what you see (e.g. "person is bleeding", "not breathing", "burn on arm").`;
}

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "I'm RoadSoS AI. I'll guide you step-by-step. Describe the emergency — bleeding, not breathing, burn, fracture, choking, accident…" },
  ]);
  const [input, setInput] = useState("");

  const ask = (q: string) => {
    if (q === "__call__") { window.location.href = telLink(EMERGENCY_NUMBERS.ambulance); return; }
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setTimeout(() => setMsgs((m) => [...m, { role: "ai", text: answer(q) }]), 250);
  };

  const send = () => {
    if (!input.trim()) return;
    const u = input;
    setInput("");
    ask(u);
  };

  return (
    <MobileShell title="AI First Aid Assistant" back="/dashboard">
      {/* AI orb */}
      <div className="mt-2 glass rounded-3xl p-6 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-ai/40 blur-2xl animate-glow" />
          <div className="relative h-24 w-24 rounded-full bg-gradient-ai glow-blue flex items-center justify-center animate-float">
            <div className="absolute inset-2 rounded-full border border-cyan-glow/40 animate-ripple" />
            <Bot className="h-10 w-10 text-white" />
          </div>
        </div>
        <p className="relative mt-4 text-sm font-semibold">Listening…</p>
        <div className="relative mt-3 flex items-end gap-1 h-10">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-ai animate-wave"
              style={{ height: `${20 + (i % 5) * 8}px`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
        <div className="relative mt-4 flex flex-wrap justify-center gap-2 text-[10px]">
          {["English", "தமிழ்", "हिन्दी"].map((l) => (
            <span key={l} className="px-2.5 py-1 rounded-full glass-strong">{l}</span>
          ))}
          <span className="px-2.5 py-1 rounded-full bg-success/20 text-success">● Offline ready</span>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {suggestions.map((s) => (
          <button key={s.label} onClick={() => ask(s.q)} className="glass rounded-2xl p-3 flex items-center gap-3 text-left active:scale-95 transition-transform">
            <div className="h-9 w-9 rounded-xl bg-gradient-ai flex items-center justify-center">
              <s.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium leading-tight">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="mt-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${m.role === "user" ? "bg-gradient-ai text-white rounded-br-md" : "glass rounded-bl-md"}`}>
              {m.text.split(/\*\*(.+?)\*\*/).map((part, idx) =>
                idx % 2 === 1 ? <strong key={idx} className="text-cyan-glow">{part}</strong> : <span key={idx}>{part}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4 glass rounded-2xl p-2 flex items-center gap-2">
        <button className="h-10 w-10 rounded-xl bg-gradient-ai flex items-center justify-center"><Mic className="h-4 w-4 text-white" /></button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe the emergency…"
          className="flex-1 bg-transparent text-sm outline-none px-2"
        />
        <button onClick={send} className="h-10 w-10 rounded-xl bg-emergency flex items-center justify-center glow-red"><Send className="h-4 w-4 text-white" /></button>
      </div>
    </MobileShell>
  );
}
