import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Ambulance, Hospital, Shield, Clock, Phone, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/tracking")({ component: Tracking });

function Tracking() {
  const [eta, setEta] = useState(360);
  useEffect(() => {
    const i = setInterval(() => setEta((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, []);
  const m = Math.floor(eta / 60), s = eta % 60;

  return (
    <MobileShell title="Live Rescue Tracking" back="/dashboard">
      {/* Map */}
      <div className="relative mt-2 h-72 rounded-3xl overflow-hidden glass">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ai/10 to-transparent" />
        {/* Route path */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.18 230)" />
              <stop offset="100%" stopColor="oklch(0.62 0.27 22)" />
            </linearGradient>
          </defs>
          <path d="M40 250 Q120 200 160 160 T280 80 L360 40" stroke="url(#rt)" strokeWidth="4" fill="none" strokeDasharray="8 8" className="animate-[shimmer_2s_linear_infinite]" />
          <path d="M40 250 Q120 200 160 160 T280 80 L360 40" stroke="oklch(0.82 0.16 200 / 30%)" strokeWidth="14" fill="none" />
        </svg>
        {/* Hospital marker */}
        <div className="absolute top-4 right-4 flex flex-col items-center">
          <div className="h-10 w-10 rounded-2xl bg-success flex items-center justify-center glow-cyan">
            <Hospital className="h-5 w-5 text-white" />
          </div>
          <span className="mt-1 text-[10px] font-medium glass px-2 py-0.5 rounded-full">Apollo</span>
        </div>
        {/* Ambulance moving */}
        <div className="absolute left-1/3 top-1/2 animate-float">
          <div className="absolute inset-0 -m-3 rounded-full bg-emergency/40 animate-ripple" />
          <div className="relative h-12 w-12 rounded-2xl bg-gradient-emergency flex items-center justify-center glow-red">
            <Ambulance className="h-6 w-6 text-white" />
          </div>
        </div>
        {/* User marker */}
        <div className="absolute bottom-6 left-6 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-ai flex items-center justify-center glow-blue">
            <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
          </div>
          <span className="mt-1 text-[10px] font-medium glass px-2 py-0.5 rounded-full">You</span>
        </div>
      </div>

      {/* Golden Hour */}
      <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/30 to-emergency/30 border border-warning/40 p-4">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-warning flex items-center justify-center">
            <Clock className="h-5 w-5 text-background" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-warning">Golden Hour Active</p>
            <p className="text-sm font-medium">52 min remaining to optimal care</p>
          </div>
        </div>
      </div>

      {/* ETA */}
      <div className="mt-4 glass rounded-3xl p-5 flex items-center gap-5">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">ETA</p>
          <p className="text-4xl font-bold text-gradient-ai tabular-nums">{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</p>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">Distance</p>
          <p className="text-lg font-semibold">2.4 km</p>
          <p className="text-xs text-success">Traffic clear</p>
        </div>
      </div>

      {/* Responder */}
      <div className="mt-4 glass rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Emergency Responder</p>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-ai flex items-center justify-center text-white font-semibold">RV</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Rajiv Verma — Paramedic</p>
            <p className="text-xs text-muted-foreground">Apollo Ambulance · TN-09-AB-2024</p>
          </div>
          <button className="h-10 w-10 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Status timeline */}
      <div className="mt-4 glass rounded-2xl p-4 space-y-3">
        {[
          { t: "Now", label: "Ambulance en route", done: true, icon: Ambulance },
          { t: "+4 min", label: "Pickup at incident location", done: false, icon: Shield },
          { t: "+9 min", label: "Arrive at Apollo Hospital", done: false, icon: Hospital },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.done ? "bg-success/20 text-success" : "glass-strong text-muted-foreground"}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.t}</p>
            </div>
            {s.done && <span className="text-xs text-success">Live</span>}
          </div>
        ))}
      </div>

      <button className="mt-4 w-full h-13 py-3.5 rounded-2xl glass-strong font-medium flex items-center justify-center gap-2">
        <Share2 className="h-4 w-4" /> Share Live Tracking with Family
      </button>
    </MobileShell>
  );
}
