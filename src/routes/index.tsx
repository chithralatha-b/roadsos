import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Splash,
  head: () => ({ meta: [{ title: "RoadSoS AI — Saving Lives Faster" }, { name: "description", content: "AI-powered emergency road safety and accident response platform." }] }),
});

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 60);
    const t = setTimeout(async () => {
      const { isVerified } = await import("@/lib/offline");
      navigate({ to: isVerified() ? "/dashboard" : "/onboarding", replace: true });
    }, 2400);
    return () => { clearInterval(i); clearTimeout(t); };
  }, [navigate]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden flex flex-col items-center justify-center px-8">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emergency/20 animate-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-ai/30 animate-glow" style={{ animationDelay: "0.5s" }} />

      {/* Scanning line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-glow/20 to-transparent animate-scan" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-emergency/40 blur-2xl animate-pulse-emergency" />
          <div className="relative h-32 w-32 rounded-full glass-strong flex items-center justify-center glow-red">
            <div className="absolute inset-2 rounded-full border border-emergency/60 animate-ripple" />
            <div className="absolute inset-2 rounded-full border border-cyan-glow/50 animate-ripple" style={{ animationDelay: "0.7s" }} />
            <Activity className="h-14 w-14 text-white drop-shadow-[0_0_20px_oklch(0.7_0.25_25)]" strokeWidth={2.5} />
          </div>
          {/* Orbiting dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-cyan-glow glow-cyan animate-orbit" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-center">
          <span className="text-gradient-emergency">RoadSoS</span>{" "}
          <span className="text-gradient-ai">AI</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground tracking-[0.2em] uppercase">Saving Lives Faster</p>

        {/* Heartbeat line */}
        <svg viewBox="0 0 200 40" className="mt-10 w-56 h-10 text-emergency">
          <path d="M0 20 L40 20 L50 5 L60 35 L70 10 L80 30 L90 20 L200 20" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-[0_0_6px_oklch(0.7_0.25_25)]" />
        </svg>

        {/* Progress */}
        <div className="mt-8 w-56 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-ai transition-all duration-100 glow-blue" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Initializing AI Safety Network…</p>
      </div>
    </div>
  );
}
