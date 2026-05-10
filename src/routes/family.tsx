import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Heart, MapPin, Ambulance, Hospital, Phone, Share2 } from "lucide-react";

export const Route = createFileRoute("/family")({ component: Family });

function Family() {
  return (
    <MobileShell title="Family Updates" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl bg-gradient-purple p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-glow/40 animate-glow" />
        <div className="relative flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center">
            <Heart className="h-7 w-7 text-emergency-glow" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/80">Status</p>
            <p className="text-xl font-bold text-white">Aarav is being cared for</p>
            <p className="text-xs text-white/80 mt-0.5">Stay calm — help arrived in 6 min</p>
          </div>
        </div>
      </div>

      <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-cyan-glow" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Live location</p>
          <p className="text-sm font-medium">En route to Apollo Hospital</p>
        </div>
        <button className="h-9 w-9 rounded-xl glass-strong flex items-center justify-center"><Share2 className="h-4 w-4" /></button>
      </div>

      <div className="mt-4 glass rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Rescue Progress</p>
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

      <div className="mt-4 glass rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Hospital & Care Team</p>
        <p className="text-sm font-semibold">Apollo Hospitals · Greams Road</p>
        <p className="text-xs text-muted-foreground">Trauma Center · Bed reserved · Dr. Mehta on standby</p>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl bg-gradient-ai text-sm font-semibold text-white flex items-center justify-center gap-2"><Phone className="h-4 w-4" />Call Hospital</button>
          <button className="flex-1 py-2.5 rounded-xl glass-strong text-sm font-medium">View Profile</button>
        </div>
      </div>
    </MobileShell>
  );
}
