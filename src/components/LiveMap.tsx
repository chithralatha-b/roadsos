import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type Marker = { lat: number; lng: number; label?: string; color?: "red" | "blue" | "green" };

declare global {
  interface Window {
    google?: any;
    __roadsosInitMap?: () => void;
    __roadsosMapReady?: boolean;
  }
}

let loaderPromise: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return reject(new Error("Maps key missing"));
    window.__roadsosInitMap = () => { window.__roadsosMapReady = true; resolve(); };
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__roadsosInitMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.onerror = () => reject(new Error("Maps failed to load"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

export function LiveMap({ center, markers = [], height = 280 }: { center: { lat: number; lng: number } | null; markers?: Marker[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!center || !ref.current) return;
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !ref.current) return;
        const g = window.google;
        if (!mapRef.current) {
          mapRef.current = new g.maps.Map(ref.current, {
            center,
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: "greedy",
            styles: DARK_STYLE,
          });
        } else {
          mapRef.current.setCenter(center);
        }
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        // user
        markersRef.current.push(new g.maps.Marker({
          position: center, map: mapRef.current,
          icon: { path: g.maps.SymbolPath.CIRCLE, scale: 9, fillColor: "#3aa3ff", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 },
          title: "You",
        }));
        markers.forEach((m) => {
          const color = m.color === "red" ? "#ff4d4d" : m.color === "green" ? "#3dd68c" : "#3aa3ff";
          markersRef.current.push(new g.maps.Marker({
            position: { lat: m.lat, lng: m.lng }, map: mapRef.current, title: m.label,
            icon: { path: g.maps.SymbolPath.CIRCLE, scale: 7, fillColor: color, fillOpacity: 1, strokeColor: "#0a0a14", strokeWeight: 2 },
          }));
        });
      })
      .catch((e) => setErr(e.message));
    return () => { cancelled = true; };
  }, [center, markers]);

  if (err) {
    return (
      <div className="rounded-3xl glass flex flex-col items-center justify-center text-xs text-muted-foreground" style={{ height }}>
        <MapPin className="h-5 w-5 mb-1" /> Map unavailable
      </div>
    );
  }
  if (!center) {
    return (
      <div className="rounded-3xl glass flex flex-col items-center justify-center text-xs text-muted-foreground animate-pulse" style={{ height }}>
        <MapPin className="h-5 w-5 mb-1" /> Acquiring GPS…
      </div>
    );
  }
  return <div ref={ref} className="rounded-3xl overflow-hidden glass" style={{ height }} />;
}

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f1424" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1424" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8c93a8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2240" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#22305a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1230" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1f2742" }] },
];
