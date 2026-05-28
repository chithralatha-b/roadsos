import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Heart, Droplet, Pill, Shield, ChevronRight, Settings, Globe, Eye, Volume2, Moon, Phone, Save, Pencil, Users, Wrench, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser, saveUser, getContacts, telLink, signOut, type User, type EmergencyContact } from "@/lib/offline";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<User | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    const u = getUser();
    setUser(u); setDraft(u);
    setContacts(getContacts());
  }, []);

  function save() {
    if (!draft) return;
    saveUser({ ...draft, guest: false });
    setUser({ ...draft, guest: false });
    setEdit(false);
  }

  if (!user || !draft) return null;

  return (
    <MobileShell title="Medical Profile" back="/dashboard">
      <div className="mt-2 relative overflow-hidden rounded-3xl glass p-5">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emergency/20 animate-glow" />
        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-ai flex items-center justify-center text-2xl text-white font-bold">{user.name[0]}</div>
          <div className="flex-1">
            {edit ? (
              <>
                <input className="w-full bg-transparent border border-border rounded-lg px-2 py-1 text-sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                <input className="w-full mt-1 bg-transparent border border-border rounded-lg px-2 py-1 text-xs" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </>
            ) : (
              <>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </>
            )}
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emergency/20 text-emergency-glow">Organ Donor ✓</span>
            </div>
          </div>
          <button onClick={() => (edit ? save() : setEdit(true))} className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center">
            {edit ? <Save className="h-5 w-5 text-success" /> : <Pencil className="h-5 w-5 text-cyan-glow" />}
          </button>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Medical Info</h2>
      <div className="grid grid-cols-2 gap-3">
        <InfoEdit icon={Droplet} label="Blood Group" value={draft.bloodGroup} edit={edit} onChange={(v: string) => setDraft({ ...draft, bloodGroup: v })} tint="emergency" />
        <InfoEdit icon={Pill} label="Allergies" value={draft.allergies} edit={edit} onChange={(v: string) => setDraft({ ...draft, allergies: v })} tint="purple-glow" />
        <InfoEdit icon={Heart} label="Conditions" value={"Asthma"} edit={false} tint="warning" />
        <InfoEdit icon={Shield} label="Insurance" value={draft.insurance} edit={edit} onChange={(v: string) => setDraft({ ...draft, insurance: v })} tint="ai" />
      </div>

      <div className="mt-5 mb-3 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Emergency Contacts</h2>
        <Link to="/contacts" className="text-[11px] font-semibold text-cyan-glow flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Manage</Link>
      </div>
      <div className="space-y-2">
        {contacts.slice(0, 3).map((c) => (
          <div key={c.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">{c.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.name} {c.family && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emergency/20 text-emergency-glow">Family</span>}</p>
              <p className="text-xs text-muted-foreground truncate">{c.relation || "Contact"}</p>
            </div>
            <a href={telLink(c.phone)} className="h-9 w-9 rounded-xl bg-success/20 text-success flex items-center justify-center"><Phone className="h-4 w-4" /></a>
          </div>
        ))}
        {contacts.length === 0 && (
          <Link to="/contacts" className="glass rounded-2xl p-4 text-center text-xs text-muted-foreground block">+ Add your first emergency contact</Link>
        )}
      </div>

      <h2 className="mt-5 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Settings</h2>
      <div className="glass rounded-2xl divide-y divide-border">
        {[
          { i: Moon, l: "Dark Mode", v: "On" },
          { i: Globe, l: "Language", v: draft.language },
          { i: Volume2, l: "Voice Navigation", v: "On" },
          { i: Eye, l: "Large Text", v: "Off" },
          { i: Settings, l: "Accessibility", v: "" },
        ].map((s) => (
          <div key={s.l} className="flex items-center gap-3 px-4 py-3.5">
            <s.i className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{s.l}</span>
            <span className="text-xs text-muted-foreground">{s.v}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Link to="/family" className="glass rounded-2xl p-4 text-center">
          <Users className="h-5 w-5 mx-auto text-purple-glow" />
          <p className="text-xs font-semibold mt-1">Family</p>
        </Link>
        <Link to="/contacts" className="glass rounded-2xl p-4 text-center">
          <Phone className="h-5 w-5 mx-auto text-cyan-glow" />
          <p className="text-xs font-semibold mt-1">Contacts</p>
        </Link>
        <Link to="/vehicle-rescue" className="glass rounded-2xl p-4 text-center">
          <Wrench className="h-5 w-5 mx-auto text-warning" />
          <p className="text-xs font-semibold mt-1">Vehicle Rescue</p>
        </Link>
      </div>

      <button
        onClick={() => { signOut(); navigate({ to: "/signup", replace: true }); }}
        className="mt-5 w-full py-3 rounded-2xl glass-strong text-sm font-medium flex items-center justify-center gap-2 text-emergency-glow"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </MobileShell>
  );
}

function InfoEdit({ icon: Icon, label, value, edit, onChange, tint }: any) {
  const c = tint === "emergency" ? "bg-emergency/15 text-emergency-glow" : tint === "warning" ? "bg-warning/15 text-warning" : tint === "purple-glow" ? "bg-purple-glow/15 text-purple-glow" : "bg-ai/15 text-cyan-glow";
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`h-9 w-9 rounded-xl ${c} flex items-center justify-center`}><Icon className="h-4 w-4" /></div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      {edit && onChange ? (
        <input className="w-full bg-transparent border border-border rounded-lg px-2 py-1 text-sm mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <p className="text-sm font-semibold">{value}</p>
      )}
    </div>
  );
}
