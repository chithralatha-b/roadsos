import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Shield, Fingerprint } from "lucide-react";
import { getUser, saveUser } from "@/lib/offline";

export const Route = createFileRoute("/signin")({ component: SignIn });

function SignIn() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleSignIn = () => {
    const existing = getUser();
    saveUser({ ...existing, phone: `+91 ${phone}`, guest: false, verified: true });
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden flex flex-col px-6 pt-12 pb-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-ai/20 animate-glow" />

      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="h-16 w-16 rounded-2xl glass-strong flex items-center justify-center glow-red mb-4">
          <Shield className="h-8 w-8 text-emergency" />
        </div>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back to RoadSoS AI</p>
      </div>

      <div className="relative z-10 glass rounded-3xl p-6 space-y-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Mobile Number</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl glass-strong px-4 py-3.5">
            <Phone className="h-5 w-5 text-cyan-glow" />
            <span className="text-sm text-muted-foreground">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              className="flex-1 bg-transparent outline-none text-sm"
              inputMode="numeric"
            />
          </div>
        </div>
        <button
          onClick={handleSignIn}
          disabled={phone.length !== 10}
          className="w-full py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white disabled:opacity-40"
        >
          Sign In
        </button>

        <button onClick={handleSignIn} disabled={phone.length !== 10} className="w-full py-3.5 rounded-2xl glass-strong font-medium flex items-center justify-center gap-2 disabled:opacity-40">
          <Fingerprint className="h-5 w-5 text-cyan-glow" /> Biometric Login
        </button>
      </div>

      <p className="relative z-10 text-center text-sm text-muted-foreground mt-6">
        New here? <Link to="/signup" className="text-cyan-glow font-semibold">Create account</Link>
      </p>
    </div>
  );
}
