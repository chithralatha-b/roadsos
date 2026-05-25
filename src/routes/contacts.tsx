import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect, useState } from "react";
import { Phone, Plus, Trash2, Users, MapPin, Heart } from "lucide-react";
import {
  getContacts,
  addContact,
  removeContact,
  updateContact,
  telLink,
  smsLink,
  buildSosMessage,
  getLastLocation,
  getUser,
  type EmergencyContact,
} from "@/lib/offline";

export const Route = createFileRoute("/contacts")({ component: Contacts });

function Contacts() {
  const [list, setList] = useState<EmergencyContact[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", relation: "", family: false });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setList(getContacts()); }, []);

  function refresh() { setList(getContacts()); }

  function submit() {
    if (!form.name.trim() || !form.phone.trim()) return;
    addContact({ ...form, shareLocation: form.family });
    setForm({ name: "", phone: "", relation: "", family: false });
    setShowForm(false);
    refresh();
  }

  function shareWithAll() {
    const loc = getLastLocation();
    const user = getUser();
    const msg = buildSosMessage(loc, user.name);
    const phones = list.filter((c) => c.shareLocation).map((c) => c.phone.replace(/\s+/g, "")).join(",");
    if (!phones) return;
    window.location.href = `sms:${phones}?body=${encodeURIComponent(msg)}`;
  }

  const family = list.filter((c) => c.family);

  return (
    <MobileShell title="Emergency Contacts" back="/profile">
      <div className="mt-2 glass rounded-3xl p-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-emergency/20 text-emergency-glow flex items-center justify-center">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Share live location</p>
          <p className="text-[11px] text-muted-foreground">Sends an SMS with your GPS to all family contacts</p>
        </div>
        <button onClick={shareWithAll} className="px-3 py-2 rounded-xl bg-gradient-emergency text-white text-xs font-semibold glow-red">
          Share now
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5 text-emergency-glow" /> Family ({family.length})
        </h2>
        <button onClick={() => setShowForm((v) => !v)} className="text-[11px] font-semibold text-cyan-glow flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add contact
        </button>
      </div>

      {showForm && (
        <div className="mt-3 glass rounded-2xl p-4 space-y-2">
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Phone (with country code)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" placeholder="Relation (Mother, Friend...)" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={form.family} onChange={(e) => setForm({ ...form, family: e.target.checked })} />
            Family member (receives live SOS location)
          </label>
          <button onClick={submit} className="w-full py-2.5 rounded-xl bg-gradient-ai text-white text-sm font-semibold glow-blue">Save</button>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {list.map((c) => (
          <div key={c.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-ai flex items-center justify-center text-white font-semibold">{c.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.name} {c.family && <span className="text-[10px] px-1.5 py-0.5 ml-1 rounded-full bg-emergency/20 text-emergency-glow">Family</span>}</p>
              <p className="text-xs text-muted-foreground truncate">{c.relation || "Contact"} · {c.phone}</p>
              <label className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <input type="checkbox" checked={c.shareLocation} onChange={(e) => { updateContact(c.id, { shareLocation: e.target.checked }); refresh(); }} />
                Share live location on SOS
              </label>
            </div>
            <a href={telLink(c.phone)} className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></a>
            <a href={smsLink(c.phone, buildSosMessage(getLastLocation(), getUser().name))} className="h-9 w-9 rounded-xl bg-ai/20 text-cyan-glow flex items-center justify-center text-xs font-bold">SMS</a>
            <button onClick={() => { removeContact(c.id); refresh(); }} className="h-9 w-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-xs text-muted-foreground">
            <Users className="h-6 w-6 mx-auto mb-2 opacity-60" /> No contacts yet
          </div>
        )}
      </div>
    </MobileShell>
  );
}
