import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Hospital, Navigation, BedDouble, Droplet, Star, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { HOSPITALS, getLastLocation, requestLocation, distanceKm, googleMapsNav, telLink, type LastLocation } from "@/lib/offline";

export const Route = createFileRoute("/hospitals")({ component: Hospitals });

const filters = ["Nearest", "Fastest Route", "Trauma", "ICU"] as const;

function Hospitals() {
  const [active, setActive] = useState<(typeof filters)[number]>("Nearest");
  const [loc, setLoc] = useState<LastLocation | null>(getLastLocation());

  useEffect(() => {
    requestLocation().then(setLoc).catch(() => {
      // Fallback: Chennai centroid for offline-first behaviour
      if (!loc) setLoc({ lat: 13.0827, lng: 80.2707, ts: Date.now(), label: "Chennai (approx)" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enriched = HOSPITALS.map((h) => ({
    ...h,
    dist: loc ? distanceKm(loc, { lat: h.lat, lng: h.lng }) : null,
  }));

  let list = [...enriched];
  if (active === "Trauma") list = list.filter((h) => h.trauma);
  if (active === "ICU") list = list.filter((h) => h.tag.includes("ICU"));
  if (active === "Nearest" || active === "Fastest Route") {
    list.sort((a, b) => (a.dist ?? 99) - (b.dist ?? 99));
  }

  return (
    <MobileShell title="Nearby Hospitals" back="/dashboard">
      {/* Mini map */}
      <div className="relative mt-2 h-44 rounded-3xl overflow-hidden glass">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-ai/10 via-transparent to-emergency/10" />
        {[{ x: "20%", y: "40%" }, { x: "55%", y: "25%" }, { x: "75%", y: "60%" }].map((p, i) => (
          <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
            <div className="absolute inset-0 -m-2 rounded-full bg-success/30 animate-ripple" />
            <div className="relative h-8 w-8 rounded-xl bg-success flex items-center justify-center"><Hospital className="h-4 w-4 text-white" /></div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-ai glow-blue flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
        </div>
        {loc && (
          <a
            href={`https://www.google.com/maps/search/hospital/@${loc.lat},${loc.lng},14z`}
            target="_blank"
            rel="noreferrer"
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-ai text-white text-[10px] font-semibold glow-blue"
          >
            Open in Google Maps
          </a>
        )}
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
        {list.map((h) => (
          <div key={h.id} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-success to-cyan-glow flex items-center justify-center"><Hospital className="h-6 w-6 text-white" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{h.name}</p>
                  <span className="flex items-center gap-0.5 text-xs text-warning"><Star className="h-3 w-3 fill-current" />{h.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {h.dist != null ? `${h.dist} km · ~${Math.max(3, Math.round(h.dist * 2.5))} min · ` : ""}{h.tag}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{h.address}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-ai/15 text-cyan-glow flex items-center gap-1"><BedDouble className="h-3 w-3" />{h.beds} beds</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emergency/15 text-emergency-glow flex items-center gap-1"><Droplet className="h-3 w-3" />{h.blood}</span>
                  {h.trauma && <span className="text-[10px] px-2 py-1 rounded-full bg-success/20 text-success">Trauma Center</span>}
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={googleMapsNav(h.lat, h.lng, h.name)} target="_blank" rel="noreferrer" className="py-2.5 rounded-xl bg-gradient-ai glow-blue text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                <Navigation className="h-4 w-4" /> Navigate
              </a>
              <a href={telLink(h.phone)} className="py-2.5 rounded-xl bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5">
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
