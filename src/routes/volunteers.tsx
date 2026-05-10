import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Users, Shield, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/volunteers")({ component: Volunteers });

const vols = [
  { name: "Priya N.", dist: "120 m", skills: ["First Aid", "CPR"], status: "Available" },
  { name: "Karthik R.", dist: "340 m", skills: ["Paramedic"], status: "On the way" },
  { name: "Anjali S.", dist: "560 m", skills: ["Nurse"], status: "Available" },
];

function Volunteers() {
  return (
    <MobileShell title="Volunteer Help Network" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-glow/20 animate-glow" />
        <div className="relative flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-purple flex items-center justify-center"><Users className="h-7 w-7 text-white" /></div>
          <div>
            <p className="text-2xl font-bold">14 verified helpers</p>
            <p className="text-xs text-muted-foreground">within 1 km of your location</p>
          </div>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Closest Responders</h2>
      <div className="space-y-3">
        {vols.map((v) => (
          <div key={v.name} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-ai flex items-center justify-center text-white font-semibold">{v.name[0]}</div>
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background flex items-center justify-center"><Shield className="h-2.5 w-2.5 text-success" /></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{v.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{v.dist} away · {v.status}</p>
              <div className="mt-1 flex gap-1.5">{v.skills.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow">{s}</span>)}</div>
            </div>
            <button className="h-9 w-9 rounded-xl bg-ai/20 text-ai-glow flex items-center justify-center"><MessageCircle className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-emergency glow-red font-semibold text-white">
        Request Immediate Help
      </button>
    </MobileShell>
  );
}
