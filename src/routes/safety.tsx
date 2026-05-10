import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Brain, Eye, Phone as PhoneIcon, Gauge, AlertTriangle, Trophy } from "lucide-react";

export const Route = createFileRoute("/safety")({ component: Safety });

function Safety() {
  return (
    <MobileShell title="Driver Safety Monitor" back="/dashboard">
      {/* Score */}
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-6">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-ai/20 animate-glow" />
        <div className="relative flex items-center gap-5">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
              <circle cx="50" cy="50" r="42" stroke="oklch(0.25 0.05 265)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="url(#sg)" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset="42" strokeLinecap="round" />
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 200)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 250)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gradient-ai">92</span>
              <span className="text-[10px] text-muted-foreground">SCORE</span>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-success">Excellent</p>
            <p className="text-lg font-semibold mt-0.5">Safe Driver Tier A</p>
            <p className="text-xs text-muted-foreground mt-1">Top 8% in Chennai this week</p>
          </div>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">AI Detections</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Eye, label: "Drowsiness", val: "Low", color: "text-success" },
          { icon: PhoneIcon, label: "Phone Use", val: "0 alerts", color: "text-success" },
          { icon: Gauge, label: "Speeding", val: "2 events", color: "text-warning" },
          { icon: AlertTriangle, label: "Harsh Brakes", val: "1 event", color: "text-warning" },
        ].map((m) => (
          <div key={m.label} className="glass rounded-2xl p-4">
            <m.icon className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">{m.label}</p>
            <p className={`text-lg font-semibold ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">AI Recommendations</h2>
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-ai flex items-center justify-center"><Brain className="h-4 w-4 text-white" /></div>
        <div>
          <p className="text-sm font-medium">Take a 5-minute break</p>
          <p className="text-xs text-muted-foreground mt-0.5">You've been driving for 2h 15m. Micro-fatigue rising.</p>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Achievements</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {["7-day streak", "No phone use", "Smooth driver", "Night master"].map((b) => (
          <div key={b} className="shrink-0 glass rounded-2xl p-3 w-32 text-center">
            <Trophy className="h-6 w-6 text-warning mx-auto" />
            <p className="text-xs font-medium mt-2">{b}</p>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
