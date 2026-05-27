import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Brain, Eye, Phone as PhoneIcon, Gauge, AlertTriangle, Trophy, RotateCcw, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribeDriverStats, resetDriverStats, type DriverStats } from "@/lib/offline";

export const Route = createFileRoute("/safety")({ component: Safety });

function tier(score: number) {
  if (score >= 90) return { label: "Excellent", tone: "text-success", tier: "Safe Driver Tier A" };
  if (score >= 75) return { label: "Good", tone: "text-cyan-glow", tier: "Tier B" };
  if (score >= 50) return { label: "Needs care", tone: "text-warning", tier: "Tier C" };
  return { label: "High risk", tone: "text-emergency-glow", tier: "Tier D" };
}

function Safety() {
  const [s, setS] = useState<DriverStats | null>(null);
  useEffect(() => subscribeDriverStats(setS), []);
  const score = s?.score ?? 100;
  const t = tier(score);
  const dash = 264;
  const offset = Math.max(0, dash - (dash * score) / 100);

  return (
    <MobileShell title="Driver Safety Monitor" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-6">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-ai/20 animate-glow" />
        <div className="relative flex items-center gap-5">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
              <circle cx="50" cy="50" r="42" stroke="oklch(0.25 0.05 265)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="url(#sg)" strokeWidth="8" fill="none" strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round" />
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 200)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 250)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gradient-ai tabular-nums">{score}</span>
              <span className="text-[10px] text-muted-foreground">LIVE SCORE</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-xs uppercase tracking-widest ${t.tone}`}>{t.label}</p>
            <p className="text-lg font-semibold mt-0.5">{t.tier}</p>
            <p className="text-xs text-muted-foreground mt-1">From real GPS · {s?.distanceKm ?? 0} km · {s?.drivingMinutes ?? 0} min</p>
            <button onClick={resetDriverStats} className="mt-2 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-lg glass-strong">
              <RotateCcw className="h-3 w-3" /> Reset trip
            </button>
          </div>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Live AI Detections (from map)</h2>
      <div className="grid grid-cols-2 gap-3">
        <Metric icon={Gauge} label="Max Speed" val={`${s?.maxSpeedKmh ?? 0} km/h`} tone={(s?.maxSpeedKmh ?? 0) > 80 ? "text-emergency-glow" : "text-success"} />
        <Metric icon={Gauge} label="Avg Speed" val={`${s?.avgSpeedKmh ?? 0} km/h`} tone="text-cyan-glow" />
        <Metric icon={AlertTriangle} label="Overspeeding" val={`${s?.overspeedEvents ?? 0} events`} tone={(s?.overspeedEvents ?? 0) > 0 ? "text-warning" : "text-success"} />
        <Metric icon={AlertTriangle} label="Harsh Brakes" val={`${s?.harshBrakes ?? 0} events`} tone={(s?.harshBrakes ?? 0) > 0 ? "text-warning" : "text-success"} />
        <Metric icon={AlertTriangle} label="Hard Accel" val={`${s?.harshAccels ?? 0} events`} tone={(s?.harshAccels ?? 0) > 0 ? "text-warning" : "text-success"} />
        <Metric icon={PhoneIcon} label="Phone Use" val={`${s?.phoneDistractions ?? 0} alerts`} tone={(s?.phoneDistractions ?? 0) > 0 ? "text-emergency-glow" : "text-success"} />
        <Metric icon={MapPin} label="Distance" val={`${s?.distanceKm ?? 0} km`} tone="text-cyan-glow" />
        <Metric icon={Eye} label="Drowsiness" val={(s?.drivingMinutes ?? 0) > 120 ? "Elevated" : "Low"} tone={(s?.drivingMinutes ?? 0) > 120 ? "text-warning" : "text-success"} />
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">AI Recommendations</h2>
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-ai flex items-center justify-center"><Brain className="h-4 w-4 text-white" /></div>
        <div>
          <p className="text-sm font-medium">{recommendation(s)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Updated live from your driving telemetry.</p>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Achievements</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {[
          { l: "Smooth driver", on: (s?.harshBrakes ?? 0) === 0 && (s?.distanceKm ?? 0) > 1 },
          { l: "No phone use", on: (s?.phoneDistractions ?? 0) === 0 },
          { l: "Speed safe", on: (s?.overspeedEvents ?? 0) === 0 },
          { l: "Score 90+", on: score >= 90 },
        ].map((b) => (
          <div key={b.l} className={`shrink-0 glass rounded-2xl p-3 w-32 text-center ${b.on ? "" : "opacity-40"}`}>
            <Trophy className={`h-6 w-6 mx-auto ${b.on ? "text-warning" : "text-muted-foreground"}`} />
            <p className="text-xs font-medium mt-2">{b.l}</p>
          </div>
        ))}
      </div>

      <Link to="/tracking" className="mt-5 block text-center text-xs text-cyan-glow font-semibold">View live map →</Link>
    </MobileShell>
  );
}

function recommendation(s: DriverStats | null) {
  if (!s) return "Acquiring telemetry…";
  if (s.phoneDistractions > 0) return "Stop using your phone while moving — keep eyes on the road.";
  if (s.harshBrakes > 2) return "Maintain larger following distance to avoid harsh braking.";
  if (s.overspeedEvents > 0) return `You crossed ${60} km/h ${s.overspeedEvents} time(s). Ease off the accelerator.`;
  if (s.drivingMinutes > 120) return "You've been driving 2h+. Take a 5-minute break.";
  return "Driving smoothly. Keep it up!";
}

function Metric({ icon: Icon, label, val, tone }: any) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${tone}`}>{val}</p>
    </div>
  );
}
