import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { AlertTriangle, CloudRain, Construction, Droplets, Navigation, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { hazardsNear, requestLocation, getLastLocation, googleMapsNav, type LastLocation, type RoadHazard } from "@/lib/offline";

export const Route = createFileRoute("/risk")({ component: Risk });

const ICONS: Record<RoadHazard["kind"], any> = {
  accident: AlertTriangle,
  flood: Droplets,
  construction: Construction,
  weather: CloudRain,
  speedbreaker: AlertTriangle,
};
const TINT: Record<RoadHazard["level"], string> = {
  High: "bg-emergency/20 text-emergency-glow",
  Medium: "bg-warning/20 text-warning",
  Low: "bg-ai/20 text-cyan-glow",
  Watch: "bg-purple-glow/20 text-purple-glow",
};

function Risk() {
  const [loc, setLoc] = useState<LastLocation | null>(null);
  const [alerts, setAlerts] = useState<(RoadHazard & { distanceKm: number })[]>([]);

  useEffect(() => {
    const seed = getLastLocation();
    setLoc(seed);
    setAlerts(hazardsNear(seed, 12));
    requestLocation()
      .then((l) => { setLoc(l); setAlerts(hazardsNear(l, 12)); })
      .catch(() => {});
  }, []);

  return (
    <MobileShell title="Smart Road Risk Alerts" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-warning flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Live · {loc ? `${loc.lat.toFixed(3)}°, ${loc.lng.toFixed(3)}°` : "locating…"}
          </p>
          <p className="text-2xl font-bold mt-1">{alerts.length} alerts near you</p>
          <p className="text-xs text-muted-foreground mt-1">Hazards detected within 12 km of your live position</p>
          {alerts[0] && (
            <a
              href={googleMapsNav(alerts[0].lat, alerts[0].lng)}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex px-4 py-2 rounded-xl bg-gradient-ai glow-blue text-sm font-semibold items-center gap-2 text-white"
            >
              <Navigation className="h-4 w-4" /> Reroute around closest
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((a) => {
          const Icon = ICONS[a.kind];
          return (
            <a
              key={a.id}
              href={googleMapsNav(a.lat, a.lng)}
              target="_blank"
              rel="noopener"
              className="glass rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${TINT[a.level]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground truncate">{a.hint} · {a.distanceKm} km away</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full glass-strong">{a.level}</span>
            </a>
          );
        })}
        {alerts.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-xs text-muted-foreground">
            No hazards detected near your live location.
          </div>
        )}
      </div>
    </MobileShell>
  );
}
