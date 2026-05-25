import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Heart, MapPin, Ambulance, Hospital, Phone, Share2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getContacts, telLink, smsLink, buildSosMessage, getLastLocation, getUser, type EmergencyContact } from "@/lib/offline";

export const Route = createFileRoute("/family")({ component: Family });

function Family() {
  const [family, setFamily] = useState<EmergencyContact[]>([]);
  useEffect(() => { setFamily(getContacts().filter((c) => c.family)); }, []);

  const loc = getLastLocation();
  const sosMsg = buildSosMessage(loc, getUser().name);

  return (
    <MobileShell title="Family Safety" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl bg-gradient-purple p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-glow/40 animate-glow" />
        <div className="relative flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center">
            <Heart className="h-7 w-7 text-emergency-glow" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/80">Family circle</p>
            <p className="text-xl font-bold text-white">{family.length} member{family.length === 1 ? "" : "s"} protected</p>
            <p className="text-xs text-white/80 mt-0.5">They get your live location on SOS</p>
          </div>
        </div>
      </div>

      <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-cyan-glow" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Last known location</p>
          <p className="text-sm font-medium truncate">{loc ? `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°` : "Awaiting GPS…"}</p>
        </div>
        {family.length > 0 && (
          <a href={`sms:${family.map((c) => c.phone.replace(/\s+/g, "")).join(",")}?body=${encodeURIComponent(sosMsg)}`} className="h-9 w-9 rounded-xl glass-strong flex items-center justify-center"><Share2 className="h-4 w-4" /></a>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Family members</h2>
        <Link to="/contacts" className="text-[11px] font-semibold text-cyan-glow flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add</Link>
      </div>
      <div className="mt-3 space-y-2">
        {family.map((c) => (
          <div key={c.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">{c.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">{c.relation} · {c.phone}</p>
            </div>
            <a href={telLink(c.phone)} className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></a>
            <a href={smsLink(c.phone, sosMsg)} className="h-9 w-9 rounded-xl bg-ai/20 text-cyan-glow flex items-center justify-center text-xs font-bold">SMS</a>
          </div>
        ))}
        {family.length === 0 && (
          <Link to="/contacts" className="glass rounded-2xl p-6 text-center text-xs text-muted-foreground block">+ Add a family member to enable live SOS sharing</Link>
        )}
      </div>

      <div className="mt-5 glass rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Rescue Progress (live demo)</p>
        <div className="space-y-4">
          {[
            { i: Ambulance, t: "Ambulance arrived", time: "8:42 PM", done: true },
            { i: Heart, t: "First aid administered", time: "8:44 PM", done: true },
            { i: Ambulance, t: "Transport to hospital", time: "Live", done: true, live: true },
            { i: Hospital, t: "Arrival at Apollo", time: "ETA 8:54 PM", done: false },
          ].map((s, idx, arr) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.done ? "bg-success/20 text-success" : "glass-strong text-muted-foreground"}`}>
                  <s.i className="h-4 w-4" />
                </div>
                {idx < arr.length - 1 && <div className={`w-px flex-1 my-1 ${s.done ? "bg-success/40" : "bg-border"}`} />}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  {s.t}
                  {s.live && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emergency/20 text-emergency-glow animate-pulse">LIVE</span>}
                </p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
