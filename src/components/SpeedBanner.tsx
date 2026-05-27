import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Gauge, AlertTriangle, ShieldCheck, Compass, ChevronRight } from "lucide-react";
import { watchDriving, SPEED_LIMIT_KMH, type DrivingSample } from "@/lib/offline";

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function dirLabel(h: number | null) {
  if (h == null || isNaN(h)) return "—";
  return DIRS[Math.round(((h % 360) / 45)) % 8];
}

export function SpeedBanner() {
  const [s, setS] = useState<DrivingSample | null>(null);

  useEffect(() => watchDriving(setS), []);

  const speed = s?.speedKmh ?? 0;
  const over = speed > SPEED_LIMIT_KMH;
  const moving = speed > 3;
  const status = over ? "Reduce Speed" : moving ? "Safe Speed" : "Stationary · tap to view live map";
  const Icon = over ? AlertTriangle : ShieldCheck;
  const tint = over
    ? "bg-emergency/15 border-emergency/40 text-emergency-glow"
    : "bg-success/10 border-success/30 text-success";

  return (
    <Link
      to="/tracking"
      className={`mt-4 rounded-2xl border glass px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-transform ${tint}`}
    >
      <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center">
        <Gauge className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tabular-nums">{speed}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">km/h</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
            <Compass className="h-3 w-3" /> {dirLabel(s?.heading ?? null)}
          </span>
        </div>
        <p className="text-xs font-semibold flex items-center gap-1.5 mt-0.5">
          <Icon className="h-3.5 w-3.5" /> {status}
          <span className="text-muted-foreground font-normal">· limit {SPEED_LIMIT_KMH} km/h</span>
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
