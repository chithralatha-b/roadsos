import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Bell, MapPin, Hospital, Bot, FileText, Users, Ambulance, Brain, AlertTriangle, Cloud, Gauge, Phone } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const features = [
  { to: "/sos", icon: AlertTriangle, label: "Emergency SOS", color: "from-emergency to-warning", glow: "glow-red" },
  { to: "/hospitals", icon: Hospital, label: "Nearby Hospitals", color: "from-success to-cyan-glow", glow: "" },
  { to: "/assistant", icon: Bot, label: "First Aid AI", color: "from-ai to-cyan-glow", glow: "glow-blue" },
  { to: "/accident", icon: FileText, label: "Accident Report", color: "from-warning to-emergency", glow: "" },
  { to: "/volunteers", icon: Users, label: "Volunteer Help", color: "from-purple-glow to-ai", glow: "" },
  { to: "/tracking", icon: Ambulance, label: "Rescue Tracking", color: "from-cyan-glow to-ai", glow: "" },
  { to: "/safety", icon: Brain, label: "Driver Safety", color: "from-purple-glow to-emergency", glow: "" },
  { to: "/risk", icon: AlertTriangle, label: "Road Risk Alerts", color: "from-warning to-purple-glow", glow: "" },
];

function Dashboard() {
  return (
    <MobileShell>
      {/* Top greeting */}
      <div className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs text-muted-foreground">Good evening</p>
          <h1 className="text-2xl font-bold tracking-tight">Aarav Sharma</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative h-11 w-11 rounded-2xl glass flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emergency animate-pulse" />
          </button>
          <div className="h-11 w-11 rounded-2xl bg-gradient-ai flex items-center justify-center text-white font-semibold">A</div>
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
            <p className="text-xs text-muted-foreground tracking-wider uppercase">Status</p>
            <p className="text-lg font-semibold">All systems active</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> Anna Nagar, Chennai
            </p>
          </div>
        </div>
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
      <h2 className="mt-6 mb-3 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Emergency Contacts</h2>
      <div className="space-y-2">
        {[
          { name: "Mom", num: "+91 98765 ••••", color: "bg-emergency" },
          { name: "Dr. Kumar", num: "Family Doctor", color: "bg-ai" },
        ].map((c) => (
          <div key={c.name} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${c.color} flex items-center justify-center text-white font-semibold`}>{c.name[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.num}</p>
            </div>
            <button className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></button>
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
