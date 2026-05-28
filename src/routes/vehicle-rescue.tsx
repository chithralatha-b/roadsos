import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect, useState } from "react";
import { Phone, Plus, Trash2, Wrench, Truck, ShieldCheck } from "lucide-react";
import { getVehicleRescue, addVehicleRescue, removeVehicleRescue, telLink, type VehicleRescueContact } from "@/lib/offline";

export const Route = createFileRoute("/vehicle-rescue")({ component: VehicleRescue });

const TYPES: VehicleRescueContact["type"][] = ["Tow", "Mechanic", "Insurance", "Highway Patrol", "Other"];

function VehicleRescue() {
  const [list, setList] = useState<VehicleRescueContact[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<{ name: string; phone: string; type: VehicleRescueContact["type"]; area: string }>({
    name: "", phone: "", type: "Tow", area: "",
  });

  useEffect(() => { setList(getVehicleRescue()); }, []);
  const refresh = () => setList(getVehicleRescue());

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    addVehicleRescue(form);
    setForm({ name: "", phone: "", type: "Tow", area: "" });
    setShow(false);
    refresh();
  };

  return (
    <MobileShell title="Vehicle Rescue" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-warning/20 animate-glow" />
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-warning to-emergency flex items-center justify-center glow-red">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-warning">Breakdown · Towing · Insurance</p>
            <p className="text-base font-semibold">Quick-dial roadside help</p>
          </div>
        </div>
        <a href={telLink("1033")} className="mt-4 block w-full py-3 rounded-2xl bg-gradient-emergency text-white font-semibold text-center glow-red">
          📞 NHAI Highway Help · 1033
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Wrench className="h-3.5 w-3.5 text-warning" /> Rescue Contacts ({list.length})
        </h2>
        <button onClick={() => setShow((v) => !v)} className="text-[11px] font-semibold text-cyan-glow flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add contact
        </button>
      </div>

      {show && (
        <div className="mt-3 glass rounded-2xl p-4 space-y-2">
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Name (e.g. Ravi Towing)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Phone with country code" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Area / city" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setForm({ ...form, type: t })} className={`px-3 py-1.5 rounded-full text-xs font-medium ${form.type === t ? "bg-gradient-ai text-white glow-blue" : "glass-strong"}`}>{t}</button>
            ))}
          </div>
          <button onClick={submit} className="w-full py-2.5 rounded-xl bg-gradient-ai text-white text-sm font-semibold glow-blue">Save</button>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {list.map((c) => (
          <div key={c.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1.5">
                {c.name}
                {c.builtin && <ShieldCheck className="h-3 w-3 text-success" />}
              </p>
              <p className="text-xs text-muted-foreground truncate">{c.type}{c.area ? ` · ${c.area}` : ""} · {c.phone}</p>
            </div>
            <a href={telLink(c.phone)} className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></a>
            {!c.builtin && (
              <button onClick={() => { removeVehicleRescue(c.id); refresh(); }} className="h-9 w-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
