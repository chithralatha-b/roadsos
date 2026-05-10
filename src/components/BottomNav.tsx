import { Link, useLocation } from "@tanstack/react-router";
import { Home, MapPin, Bot, Users, User } from "lucide-react";

const items = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/hospitals", icon: MapPin, label: "Hospitals" },
  { to: "/sos", icon: null, label: "SOS" },
  { to: "/assistant", icon: Bot, label: "AI" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-4 pt-2">
      <div className="glass-strong rounded-3xl flex items-center justify-around px-2 py-2 shadow-card">
        {items.map((item) => {
          const active = pathname === item.to;
          if (item.label === "SOS") {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-emergency glow-red animate-pulse-emergency"
                aria-label="Emergency SOS"
              >
                <span className="absolute inset-0 rounded-full bg-emergency/40 animate-ripple" />
                <span className="relative font-bold text-white text-sm tracking-wider">SOS</span>
              </Link>
            );
          }
          const Icon = item.icon!;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${active ? "text-cyan-glow" : "text-muted-foreground"}`}
            >
              <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_8px_oklch(0.82_0.16_200)]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
