import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { AlertTriangle, CloudRain, Construction, Droplets, Navigation } from "lucide-react";

export const Route = createFileRoute("/risk")({ component: Risk });

const alerts = [
  { icon: AlertTriangle, title: "Accident-prone zone", loc: "GST Road · 1.2 km ahead", level: "High", color: "emergency" },
  { icon: Droplets, title: "Flooded road", loc: "Velachery Tank · 3 km", level: "Medium", color: "warning" },
  { icon: Construction, title: "Construction", loc: "Mount Road · 4.5 km", level: "Low", color: "ai" },
  { icon: CloudRain, title: "Heavy rain expected", loc: "9 PM tonight", level: "Watch", color: "purple-glow" },
];

function Risk() {
  return (
    <MobileShell title="Smart Road Risk Alerts" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-warning">Predictive Intelligence</p>
          <p className="text-2xl font-bold mt-1">4 alerts on your route</p>
          <p className="text-xs text-muted-foreground mt-1">AI detected potential hazards in next 10 km</p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-gradient-ai glow-blue text-sm font-semibold flex items-center gap-2 text-white">
            <Navigation className="h-4 w-4" /> Reroute Smartly
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((a) => (
          <div key={a.title} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${a.color === "emergency" ? "bg-emergency/20 text-emergency-glow" : a.color === "warning" ? "bg-warning/20 text-warning" : a.color === "ai" ? "bg-ai/20 text-cyan-glow" : "bg-purple-glow/20 text-purple-glow"}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.loc}</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full glass-strong">{a.level}</span>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
