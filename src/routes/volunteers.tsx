import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Users, Shield, MapPin, Phone, Plus, X, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getVolunteers, addVolunteer, telLink, smsLink, type Volunteer } from "@/lib/offline";

export const Route = createFileRoute("/volunteers")({ component: Volunteers });

function Volunteers() {
  const [list, setList] = useState<Volunteer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", skills: "First Aid", area: "" });

  useEffect(() => { setList(getVolunteers()); }, []);

  const submit = () => {
    if (!form.name || form.phone.length < 10) return;
    addVolunteer({
      name: form.name,
      phone: `+91${form.phone}`,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      area: form.area || "Chennai",
    });
    setList(getVolunteers());
    setForm({ name: "", phone: "", skills: "First Aid", area: "" });
    setOpen(false);
  };

  return (
    <MobileShell title="Volunteer Help Network" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-glow/20 animate-glow" />
        <div className="relative flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-purple flex items-center justify-center"><Users className="h-7 w-7 text-white" /></div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{list.length} verified helpers</p>
            <p className="text-xs text-muted-foreground">within 1 km of your location</p>
          </div>
          <button onClick={() => setOpen(true)} className="h-11 w-11 rounded-2xl bg-gradient-ai glow-blue flex items-center justify-center" aria-label="Add volunteer">
            <Plus className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Closest Responders</h2>
      <div className="space-y-3">
        {list.map((v) => (
          <div key={v.id} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-ai flex items-center justify-center text-white font-semibold">{v.name[0]}</div>
                {v.verified && <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background flex items-center justify-center"><Shield className="h-2.5 w-2.5 text-success" /></span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{v.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{v.distanceKm} km · {v.area} · {v.status}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">{v.skills.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow">{s}</span>)}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={telLink(v.phone)} className="py-2 rounded-xl bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a href={smsLink(v.phone, "Emergency near me — RoadSoS AI alert. Please help.")} className="py-2 rounded-xl bg-ai/20 text-cyan-glow text-xs font-semibold flex items-center justify-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" /> SMS
              </a>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 mb-2 w-full py-3.5 rounded-2xl bg-gradient-emergency glow-red font-semibold text-white">
        Request Immediate Help
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-strong rounded-t-3xl p-5 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Register as Volunteer</h3>
              <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-xl glass flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full px-4 py-3 rounded-2xl glass text-sm outline-none" />
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass">
                <span className="text-sm text-muted-foreground">+91</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="Phone" inputMode="numeric" className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Area (e.g. Anna Nagar)" className="w-full px-4 py-3 rounded-2xl glass text-sm outline-none" />
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" className="w-full px-4 py-3 rounded-2xl glass text-sm outline-none" />
              <button onClick={submit} disabled={!form.name || form.phone.length !== 10} className="w-full py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white disabled:opacity-40">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
