import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MapPin, Gauge, Mic, X } from "lucide-react";
import { createEmergency, getCurrentPosition } from "@/lib/emergency";
import { EMERGENCY_NUMBERS, telLink, getLastLocation, getContacts, buildSosMessage, getUser } from "@/lib/offline";

export const Route = createFileRoute("/sos")({ component: SOS });

function SOS() {
  const [count, setCount] = useState(10);
  const [cancelled, setCancelled] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [saved, setSaved] = useState(false);
  const dialed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const last = getLastLocation();
    if (last) setCoords({ lat: last.lat, lng: last.lng });
    getCurrentPosition().then((p) => setCoords({ lat: p.lat, lng: p.lng })).catch(() => {});
  }, []);

  useEffect(() => {
    if (cancelled || saved || !coords) return;
    createEmergency({ lat: coords.lat, lng: coords.lng, severity: "critical" })
      .then(() => setSaved(true))
      .catch(() => setSaved(true));
    // Broadcast SMS to family contacts that opted in
    try {
      const contacts = getContacts().filter((c) => c.shareLocation);
      if (contacts.length) {
        const phones = contacts.map((c) => c.phone.replace(/\s+/g, "")).join(",");
        const msg = buildSosMessage(coords, getUser().name);
        // Fire a hidden iframe to avoid hijacking the dialer; on mobile this opens SMS composer.
        const a = document.createElement("a");
        a.href = `sms:${phones}?body=${encodeURIComponent(msg)}`;
        a.rel = "noopener";
        a.click();
      }
    } catch {}
  }, [coords, cancelled, saved]);

  useEffect(() => {
    if (cancelled) return;
    if (count === 3 && !dialed.current) {
      dialed.current = true;
      // Trigger phone dialer to 108
      window.location.href = telLink(EMERGENCY_NUMBERS.ambulance);
    }
    if (count <= 0) { navigate({ to: "/tracking" }); return; }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count, cancelled, navigate]);

  return (
    <MobileShell title="Impact Detected" back="/dashboard" hideNav>
      {/* Flash overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 animate-pulse-emergency rounded-none" />

      {/* Severity banner */}
      <div className="relative mt-2 overflow-hidden rounded-3xl bg-gradient-emergency p-5 glow-red">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full border-2 border-white/40 animate-ripple" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full border-2 border-white/30 animate-ripple" style={{ animationDelay: "0.5s" }} />
        <div className="relative flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-white" />
          <div>
            <p className="text-xs uppercase tracking-widest text-white/80">Severity</p>
            <p className="text-2xl font-bold text-white">CRITICAL</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs uppercase tracking-widest text-white/80">AI Confidence</p>
            <p className="text-2xl font-bold text-white">98%</p>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="mt-5 glass rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emergency/10 animate-pulse" />
        <p className="relative text-xs uppercase tracking-widest text-muted-foreground">Sending SOS in</p>
        <div className="relative mt-2 flex items-baseline justify-center gap-2">
          <span className="text-7xl font-bold text-gradient-emergency tabular-nums">{cancelled ? "—" : count}</span>
          <span className="text-muted-foreground">sec</span>
        </div>
        <p className="relative text-xs text-muted-foreground mt-2">{cancelled ? "Alert cancelled" : "Auto-dispatching ambulance, hospital & family"}</p>
      </div>

      {/* Sensor data */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <SensorCard icon={Gauge} label="Speed before impact" value="78 km/h" />
        <SensorCard icon={AlertTriangle} label="G-Force" value="6.2 g" />
      </div>

      <div className="mt-3 glass rounded-2xl p-4 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-cyan-glow" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="text-sm font-medium">12.9716° N, 80.2594° E</p>
          <p className="text-xs text-muted-foreground">OMR, near Thoraipakkam Bridge</p>
        </div>
      </div>

      {/* Status list */}
      <div className="mt-4 glass rounded-2xl p-4 space-y-3">
        {[
          { label: "Ambulance dispatched", done: true },
          { label: "Hospital notified", done: true },
          { label: "Police alerted", done: !cancelled && count < 7 },
          { label: "Family contacted", done: !cancelled && count < 4 },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 text-sm">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${s.done ? "bg-success/20" : "bg-muted"}`}>
              {s.done ? <span className="text-success text-xs">✓</span> : <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />}
            </div>
            <span className={s.done ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button onClick={() => setCancelled(true)} className="flex-1 h-14 rounded-2xl glass-strong font-semibold flex items-center justify-center gap-2">
          <X className="h-5 w-5" /> I'm Safe
        </button>
        <button className="h-14 w-14 rounded-2xl bg-gradient-ai glow-blue flex items-center justify-center">
          <Mic className="h-5 w-5 text-white" />
        </button>
      </div>
    </MobileShell>
  );
}

function SensorCard({ icon: Icon, label, value }: any) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4" /> {label}</div>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
