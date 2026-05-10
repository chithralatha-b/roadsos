import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Hospital, Navigation, BedDouble, Droplet, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/hospitals")({ component: Hospitals });

const filters = ["Nearest", "Fastest Route", "Trauma", "ICU"];
const hospitals = [
  { name: "Apollo Hospitals", dist: "2.4 km", eta: "6 min", beds: 12, blood: "All groups", rating: 4.9, trauma: true, tag: "Trauma Level 1" },
  { name: "Fortis Malar", dist: "3.8 km", eta: "9 min", beds: 6, blood: "O+, A+, B-", rating: 4.7, trauma: true, tag: "ICU Available" },
  { name: "MIOT International", dist: "5.1 km", eta: "12 min", beds: 22, blood: "All groups", rating: 4.8, trauma: false, tag: "Multi-specialty" },
];

function Hospitals() {
  const [active, setActive] = useState("Nearest");
  return (
    <MobileShell title="Nearby Hospitals" back="/dashboard">
      {/* Mini map */}
      <div className="relative mt-2 h-44 rounded-3xl overflow-hidden glass">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-ai/10 via-transparent to-emergency/10" />
        {[
          { x: "20%", y: "40%" },
          { x: "55%", y: "25%" },
          { x: "75%", y: "60%" },
        ].map((p, i) => (
          <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
            <div className="absolute inset-0 -m-2 rounded-full bg-success/30 animate-ripple" />
            <div className="relative h-8 w-8 rounded-xl bg-success flex items-center justify-center"><Hospital className="h-4 w-4 text-white" /></div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-ai glow-blue flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button key={f} onClick={() => setActive(f)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium ${active === f ? "bg-gradient-ai text-white glow-blue" : "glass"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-3">
        {hospitals.map((h) => (
          <div key={h.name} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-success to-cyan-glow flex items-center justify-center"><Hospital className="h-6 w-6 text-white" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{h.name}</p>
                  <span className="flex items-center gap-0.5 text-xs text-warning"><Star className="h-3 w-3 fill-current" />{h.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{h.dist} · {h.eta} · {h.tag}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-ai/15 text-cyan-glow flex items-center gap-1"><BedDouble className="h-3 w-3" />{h.beds} beds</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emergency/15 text-emergency-glow flex items-center gap-1"><Droplet className="h-3 w-3" />{h.blood}</span>
                  {h.trauma && <span className="text-[10px] px-2 py-1 rounded-full bg-success/20 text-success">Trauma Center</span>}
                </div>
              </div>
            </div>
            <button className="mt-3 w-full py-2.5 rounded-xl bg-gradient-ai glow-blue text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Navigation className="h-4 w-4" /> Navigate · {h.eta}
            </button>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
