import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Bot, Mic, Send, Heart, Droplet, Activity, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assistant")({ component: Assistant });

const suggestions = [
  { icon: Heart, label: "Check breathing", color: "from-emergency to-warning" },
  { icon: Droplet, label: "Stop bleeding", color: "from-emergency to-purple-glow" },
  { icon: Activity, label: "Start CPR", color: "from-ai to-cyan-glow" },
  { icon: Phone, label: "Call doctor", color: "from-success to-cyan-glow" },
];

function Assistant() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "I'm RoadSoS AI. I'll guide you step-by-step. Is the person conscious and breathing?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const u = input;
    setMsgs((m) => [...m, { role: "user", text: u }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: "Got it. Tilt their head back gently, lift the chin, and check for chest movement for 10 seconds. I'll start a timer." }]);
    }, 700);
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
        {/* Voice wave */}
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
          <button key={s.label} className="glass rounded-2xl p-3 flex items-center gap-3 text-left active:scale-95 transition-transform">
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
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
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === "user" ? "bg-gradient-ai text-white rounded-br-md" : "glass rounded-bl-md"}`}>
              {m.text}
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
