import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { LiveMap } from "@/components/LiveMap";
import { SpeedBanner } from "@/components/SpeedBanner";
import { Bell, MapPin, Hospital, Bot, FileText, Users, Ambulance, Brain, AlertTriangle, Cloud, Gauge, Phone, Wifi, WifiOff, UserPlus, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getUser, requestLocation, getLastLocation, EMERGENCY_NUMBERS, telLink, HOSPITALS, getUsageStreak, type User, type LastLocation } from "@/lib/offline";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const features = [
  { to: "/sos", icon: AlertTriangle, label: "Emergency SOS", color: "from-emergency to-warning", glow: "glow-red" },
  { to: "/hospitals", icon: Hospital, label: "Nearby Hospitals", color: "from-success to-cyan-glow", glow: "" },
  { to: "/assistant", icon: Bot, label: "First Aid AI", color: "from-ai to-cyan-glow", glow: "glow-blue" },
  { to: "/accident", icon: FileText, label: "Accident Report", color: "from-warning to-emergency", glow: "" },
  { to: "/volunteers", icon: Users, label: "Volunteer Help", color: "from-purple-glow to-ai", glow: "" },
  { to: "/tracking", icon: Ambulance, label: "Rescue Tracking", color: "from-cyan-glow to-ai", glow: "" },
  { to: "/vehicle-rescue", icon: Wrench, label: "Vehicle Rescue", color: "from-warning to-cyan-glow", glow: "" },
  { to: "/safety", icon: Brain, label: "Driver Safety", color: "from-purple-glow to-emergency", glow: "" },
  { to: "/risk", icon: AlertTriangle, label: "Road Risk Alerts", color: "from-warning to-purple-glow", glow: "" },
];

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loc, setLoc] = useState<LastLocation | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setLoc(getLastLocation());
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    requestLocation().then(setLoc).catch(() => {});
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  })();

  const hospitalMarkers = useMemo(
    () => HOSPITALS.map((h) => ({ lat: h.lat, lng: h.lng, label: h.name, color: "green" as const })),
    [],
  );

  return (
    <MobileShell>
      {/* Top greeting */}
      <div className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight">{user?.name ?? "Guest"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative h-11 w-11 rounded-2xl glass flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emergency animate-pulse" />
          </button>
          <Link to="/profile" className="h-11 w-11 rounded-2xl bg-gradient-ai flex items-center justify-center text-white font-semibold">
            {(user?.name ?? "G")[0]}
          </Link>
        </div>
      </div>

      {/* Status hero */}
      <div className="mt-5 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-success/20 animate-glow" />
        <div className="relative flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full glass-strong flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-success/40 animate-ripple" />
            <div className="h-3 w-3 rounded-full bg-success shadow-[0_0_20px_oklch(0.72_0.18_155)]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
              Status {online ? <Wifi className="h-3 w-3 text-success" /> : <WifiOff className="h-3 w-3 text-warning" />}
              <span className={online ? "text-success" : "text-warning"}>{online ? "Online" : "Offline · cached data"}</span>
            </p>
            <p className="text-lg font-semibold">All systems active</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {loc ? `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°` : "Locating…"}
            </p>
          </div>
        </div>
        {/* Quick dial emergency */}
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          {[
            { n: "108", l: "Ambulance", c: "bg-emergency/20 text-emergency-glow", href: telLink(EMERGENCY_NUMBERS.ambulance) },
            { n: "112", l: "Emergency", c: "bg-ai/20 text-cyan-glow", href: telLink(EMERGENCY_NUMBERS.unified) },
            { n: "100", l: "Police", c: "bg-purple-glow/20 text-purple-glow", href: telLink(EMERGENCY_NUMBERS.police) },
          ].map((b) => (
            <a key={b.n} href={b.href} className={`py-2 rounded-xl ${b.c} text-center`}>
              <p className="text-base font-bold">{b.n}</p>
              <p className="text-[10px]">{b.l}</p>
            </a>
          ))}
        </div>
      </div>


      {/* Live speed / direction banner (GPS) */}
      <SpeedBanner />

      {/* Live map */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Live Map · Nearby Hospitals</h2>
          <Link to="/hospitals" className="text-[11px] text-cyan-glow font-semibold">View all →</Link>
        </div>
        <LiveMap
          center={loc ? { lat: loc.lat, lng: loc.lng } : null}
          markers={hospitalMarkers}
          height={220}
        />
      </div>

      {/* Score widgets */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ScoreCard icon={Gauge} label="Safety Score" value="92" max="100" tint="ai" />
        <ScoreCard icon={Brain} label="Readiness" value="A+" tint="success" />
      </div>

      {/* Live ticker */}
      <div className="mt-4 glass rounded-2xl px-4 py-3 flex items-center gap-3 overflow-hidden">
        <Cloud className="h-5 w-5 text-cyan-glow shrink-0" />
        <div className="flex gap-6 animate-[shimmer_18s_linear_infinite] whitespace-nowrap text-xs text-muted-foreground">
          <span>⚠️ Wet road ahead — OMR</span>
          <span>🚧 Construction — Mount Road</span>
          <span>🌧️ Light rain expected 9 PM</span>
          <span>🚑 Avg ambulance ETA: 6 min</span>
        </div>
      </div>

      {/* Features grid */}
      <h2 className="mt-6 mb-3 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className={`group relative overflow-hidden rounded-2xl glass p-4 h-28 flex flex-col justify-between ${f.glow} transition-transform active:scale-95`}>
            <div className={`absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br ${f.color} opacity-30 blur-xl`} />
            <div className={`relative h-10 w-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <p className="relative text-sm font-semibold leading-tight">{f.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick contacts */}
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Emergency Contacts</h2>
        <Link to="/contacts" className="text-[11px] font-semibold text-cyan-glow flex items-center gap-1">
          <UserPlus className="h-3.5 w-3.5" /> Manage
        </Link>
      </div>
      <div className="space-y-2">
        {[
          { name: "Mom", num: "+91 98765 ••••", color: "bg-emergency", href: telLink("+919876512345") },
          { name: "Dr. Kumar", num: "Family Doctor", color: "bg-ai", href: telLink("+919840098765") },
        ].map((c) => (
          <div key={c.name} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${c.color} flex items-center justify-center text-white font-semibold`}>{c.name[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.num}</p>
            </div>
            <a href={c.href} className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></a>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

function ScoreCard({ icon: Icon, label, value, max, tint }: any) {
  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full ${tint === "ai" ? "bg-ai/20" : "bg-success/20"} blur-xl`} />
      <div className="relative flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="relative mt-2 flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${tint === "ai" ? "text-gradient-ai" : "text-success"}`}>{value}</span>
        {max && <span className="text-xs text-muted-foreground">/ {max}</span>}
      </div>
    </div>
  );
}
