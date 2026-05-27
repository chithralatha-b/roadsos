import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Shield, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden flex flex-col px-6 pt-12 pb-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-ai/20 animate-glow" />

      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="h-16 w-16 rounded-2xl glass-strong flex items-center justify-center glow-red mb-4">
          <Shield className="h-8 w-8 text-emergency" />
        </div>
        <h1 className="text-2xl font-bold">Welcome to RoadSoS AI</h1>
        <p className="text-sm text-muted-foreground mt-1">Secure medical-grade authentication</p>
      </div>

      <div className="relative z-10 glass rounded-3xl p-6 space-y-5">
        {step === "phone" ? (
          <>
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
              onClick={() => phone.length === 10 && setStep("otp")}
              disabled={phone.length !== 10}
              className="w-full h-13 py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white disabled:opacity-40"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Enter 4-digit OTP</label>
              <div className="mt-3 flex gap-3 justify-between">
                {otp.map((d, idx) => (
                  <input
                    key={idx}
                    value={d}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(-1);
                      const n = [...otp]; n[idx] = v; setOtp(n);
                      if (v && idx < 3) (document.getElementById(`otp-${idx + 1}`) as HTMLInputElement)?.focus();
                    }}
                    id={`otp-${idx}`}
                    className="w-14 h-16 text-center text-2xl font-bold rounded-2xl glass-strong outline-none focus:glow-blue"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Code sent to +91 {phone}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="w-full py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white"
            >
              Verify & Continue
            </button>
          </>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button onClick={() => navigate({ to: "/dashboard" })} className="w-full py-3.5 rounded-2xl glass-strong font-medium flex items-center justify-center gap-2">
          <Fingerprint className="h-5 w-5 text-cyan-glow" /> Biometric Login
        </button>

        <button onClick={() => navigate({ to: "/dashboard" })} className="w-full py-3 rounded-2xl glass font-medium text-sm">
          Continue as Guest →
        </button>
        <p className="text-[11px] text-muted-foreground text-center -mt-2">All emergency features work without signing in.</p>
      </div>

      <div className="relative z-10 mt-auto pt-8 flex justify-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-success" /> End-to-end encrypted</span>
      </div>
    </div>
  );
}
