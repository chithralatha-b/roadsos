import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Heart, Droplet, Pill, Shield, QrCode, ChevronRight, Settings, Globe, Eye, Volume2, Moon, Phone } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <MobileShell title="Medical Profile" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emergency/20 animate-glow" />
        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-ai flex items-center justify-center text-2xl text-white font-bold">A</div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Aarav Sharma</p>
            <p className="text-xs text-muted-foreground">28 yrs · Male · 178 cm</p>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emergency/20 text-emergency-glow">Organ Donor ✓</span>
            </div>
          </div>
          <button className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center"><QrCode className="h-5 w-5 text-cyan-glow" /></button>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Medical Info</h2>
      <div className="grid grid-cols-2 gap-3">
        <Info icon={Droplet} label="Blood Group" val="O+" tint="emergency" />
        <Info icon={Heart} label="Conditions" val="Asthma" tint="warning" />
        <Info icon={Pill} label="Allergies" val="Penicillin" tint="purple-glow" />
        <Info icon={Shield} label="Insurance" val="Star Health" tint="ai" />
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Emergency Contacts</h2>
      <div className="space-y-2">
        {[
          { n: "Mom", r: "+91 98765 ••••" },
          { n: "Dr. Kumar", r: "Family Doctor" },
        ].map((c) => (
          <div key={c.n} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">{c.n[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{c.n}</p>
              <p className="text-xs text-muted-foreground">{c.r}</p>
            </div>
            <Phone className="h-4 w-4 text-success" />
          </div>
        ))}
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Settings</h2>
      <div className="glass rounded-2xl divide-y divide-border">
        {[
          { i: Moon, l: "Dark Mode", v: "On" },
          { i: Globe, l: "Language", v: "English" },
          { i: Volume2, l: "Voice Navigation", v: "On" },
          { i: Eye, l: "Large Text", v: "Off" },
          { i: Settings, l: "Accessibility", v: "" },
        ].map((s) => (
          <div key={s.l} className="flex items-center gap-3 px-4 py-3.5">
            <s.i className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{s.l}</span>
            <span className="text-xs text-muted-foreground">{s.v}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/family" className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">View as</p>
          <p className="text-sm font-semibold mt-1">Family Tracker</p>
        </Link>
        <Link to="/onboarding" className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Replay</p>
          <p className="text-sm font-semibold mt-1">Onboarding</p>
        </Link>
      </div>
    </MobileShell>
  );
}

function Info({ icon: Icon, label, val, tint }: any) {
  const c = tint === "emergency" ? "bg-emergency/15 text-emergency-glow" : tint === "warning" ? "bg-warning/15 text-warning" : tint === "purple-glow" ? "bg-purple-glow/15 text-purple-glow" : "bg-ai/15 text-cyan-glow";
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`h-9 w-9 rounded-xl ${c} flex items-center justify-center`}><Icon className="h-4 w-4" /></div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{val}</p>
    </div>
  );
}
