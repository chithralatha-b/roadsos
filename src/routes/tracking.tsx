import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { LiveMap } from "@/components/LiveMap";
import { Ambulance, Hospital, Clock, Phone, Share2, Gauge, Compass, MapPin, Navigation } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  watchDriving,
  HOSPITALS,
  distanceKm,
  telLink,
  smsLink,
  buildSosMessage,
  googleMapsNav,
  getUser,
  type DrivingSample,
} from "@/lib/offline";

export const Route = createFileRoute("/tracking")({ component: Tracking });

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const dirLabel = (h: number | null) => (h == null || isNaN(h) ? "—" : DIRS[Math.round(((h % 360) / 45)) % 8]);

function Tracking() {
  const [sample, setSample] = useState<DrivingSample | null>(null);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    const stop = watchDriving((s) => {
      setSample(s);
      setPath((p) => {
        const last = p[p.length - 1];
        if (last && Math.abs(last.lat - s.lat) < 0.00002 && Math.abs(last.lng - s.lng) < 0.00002) return p;
        const next = [...p, { lat: s.lat, lng: s.lng }];
        return next.length > 60 ? next.slice(-60) : next;
      });
    });
    return stop;
  }, []);

  const center = sample ? { lat: sample.lat, lng: sample.lng } : null;

  const nearest = useMemo(() => {
    if (!center) return null;
    return [...HOSPITALS]
      .map((h) => ({ ...h, dist: distanceKm(center, { lat: h.lat, lng: h.lng }) }))
      .sort((a, b) => a.dist - b.dist)[0];
  }, [center]);

  const markers = useMemo(() => {
    const m: { lat: number; lng: number; label?: string; color?: "red" | "blue" | "green" }[] = [];
    if (nearest) m.push({ lat: nearest.lat, lng: nearest.lng, label: nearest.name, color: "green" });
    path.forEach((p, i) => i % 4 === 0 && m.push({ lat: p.lat, lng: p.lng, color: "blue" }));
    return m;
  }, [nearest, path]);

  const moving = (sample?.speedKmh ?? 0) > 3;
  const user = getUser();

  return (
    <MobileShell title="Live Rescue Tracking" back="/dashboard">
      {/* Real-time map */}
      <div className="mt-2">
        <LiveMap center={center} markers={markers} height={300} />
      </div>

      {/* Live driving stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Gauge className="h-3 w-3" /> Speed
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gradient-ai">{sample?.speedKmh ?? 0}<span className="text-[10px] text-muted-foreground ml-1">km/h</span></p>
        </div>
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Compass className="h-3 w-3" /> Heading
          </div>
          <p className="mt-1 text-2xl font-bold">{dirLabel(sample?.heading ?? null)}</p>
        </div>
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3" /> Status
          </div>
          <p className={`mt-1 text-sm font-bold ${moving ? "text-success" : "text-warning"}`}>{moving ? "Moving" : "Stationary"}</p>
        </div>
      </div>

      {/* GPS coords */}
      {center && (
        <div className="mt-3 glass rounded-2xl px-4 py-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
          <span><MapPin className="inline h-3 w-3 mr-1" />{center.lat.toFixed(5)}°, {center.lng.toFixed(5)}°</span>
          <span>{path.length} pts</span>
        </div>
      )}

      {/* Golden hour */}
      <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/30 to-emergency/30 border border-warning/40 p-4">
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

      {/* Nearest hospital */}
      {nearest && (
        <div className="mt-4 glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Nearest Hospital</p>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-success to-cyan-glow flex items-center justify-center">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{nearest.name}</p>
              <p className="text-xs text-muted-foreground">{nearest.dist} km · ~{Math.max(3, Math.round(nearest.dist * 2.5))} min</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={googleMapsNav(nearest.lat, nearest.lng, nearest.name)} target="_blank" rel="noreferrer" className="py-2.5 rounded-xl bg-gradient-ai glow-blue text-xs font-semibold text-white flex items-center justify-center gap-1.5">
              <Navigation className="h-4 w-4" /> Navigate
            </a>
            <a href={telLink(nearest.phone)} className="py-2.5 rounded-xl bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5">
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
        </div>
      )}

      {/* Ambulance status */}
      <div className="mt-4 glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-2xl bg-gradient-emergency flex items-center justify-center glow-red">
            <div className="absolute inset-0 -m-2 rounded-2xl bg-emergency/40 animate-ripple" />
            <Ambulance className="relative h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Ambulance dispatch</p>
            <p className="text-xs text-muted-foreground">Tap 108 to request immediate pickup at your live GPS</p>
          </div>
          <a href={telLink("108")} className="h-10 w-10 rounded-xl bg-emergency/20 text-emergency-glow flex items-center justify-center"><Phone className="h-4 w-4" /></a>
        </div>
      </div>

      <a
        href={smsLink("", buildSosMessage(center, user.name))}
        className="mt-4 w-full py-3.5 rounded-2xl glass-strong font-medium flex items-center justify-center gap-2"
      >
        <Share2 className="h-4 w-4" /> Share Live Tracking
      </a>

      <Link to="/contacts" className="mt-2 block text-center text-[11px] text-cyan-glow font-semibold">
        Send SOS to all family contacts →
      </Link>
    </MobileShell>
  );
}
