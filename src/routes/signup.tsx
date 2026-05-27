import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, ArrowRight, User as UserIcon, Droplet } from "lucide-react";
import { saveUser } from "@/lib/offline";

export const Route = createFileRoute("/signup")({ component: SignUp });

const BLOOD = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const LANGS = ["English", "தமிழ்", "हिन्दी"] as const;

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("");
  const [blood, setBlood] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("English");

  const submit = () => {
    saveUser({
      id: `u-${Date.now()}`,
      name: name || "RoadSoS User",
      phone: `+91 ${phone}`,
      bloodGroup: blood,
      allergies: allergies || "None reported",
      conditions: "None",
      insurance: "Not provided",
      emergencyContact: `+91 ${contact}`,
      language: lang,
      guest: false,
    });
    navigate({ to: "/dashboard" });
  };

  const ready = name && phone.length === 10 && contact.length === 10;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden flex flex-col px-6 pt-10 pb-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-emergency/20 animate-glow" />

      <div className="relative z-10 flex flex-col items-center mb-6">
        <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center glow-blue mb-3">
          <Shield className="h-7 w-7 text-cyan-glow" />
        </div>
        <h1 className="text-2xl font-bold">Create your safety profile</h1>
        <p className="text-xs text-muted-foreground mt-1">Used during emergencies to save your life</p>
      </div>

      <div className="relative z-10 glass rounded-3xl p-5 space-y-4">
        <Field label="Full Name" icon={<UserIcon className="h-4 w-4 text-cyan-glow" />}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="flex-1 bg-transparent outline-none text-sm" />
        </Field>

        <Field label="Mobile Number" icon={<span className="text-sm text-muted-foreground">+91</span>}>
          <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" inputMode="numeric" className="flex-1 bg-transparent outline-none text-sm" />
        </Field>

        <Field label="Emergency Contact" icon={<span className="text-sm text-muted-foreground">+91</span>}>
          <input value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Family / friend" inputMode="numeric" className="flex-1 bg-transparent outline-none text-sm" />
        </Field>

        <div>
          <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-1"><Droplet className="h-3 w-3" /> Blood Group</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BLOOD.map((b) => (
              <button key={b} onClick={() => setBlood(b)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${blood === b ? "bg-gradient-emergency text-white glow-red" : "glass-strong"}`}>{b}</button>
            ))}
          </div>
        </div>

        <Field label="Allergies / Conditions">
          <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Penicillin, asthma…" className="flex-1 bg-transparent outline-none text-sm" />
        </Field>

        <div>
          <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Language</label>
          <div className="mt-2 flex gap-2">
            {LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-xl text-xs font-medium ${lang === l ? "bg-gradient-ai text-white glow-blue" : "glass-strong"}`}>{l}</button>
            ))}
          </div>
        </div>

        <button onClick={submit} disabled={!ready} className="w-full py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2">
          Create Account <ArrowRight className="h-4 w-4" />
        </button>

        <button onClick={() => navigate({ to: "/dashboard" })} className="w-full py-3 rounded-2xl glass font-medium text-sm">
          Skip — Continue as Guest
        </button>
      </div>

      <p className="relative z-10 text-center text-sm text-muted-foreground mt-6">
        Already registered? <Link to="/signin" className="text-cyan-glow font-semibold">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">{label}</label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl glass-strong px-4 py-3">
        {icon}
        {children}
      </div>
    </div>
  );
}
