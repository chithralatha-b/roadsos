import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { FileText, Camera, MapPin, Mic } from "lucide-react";

export const Route = createFileRoute("/accident")({ component: Report });

function Report() {
  return (
    <MobileShell title="Accident Report" back="/dashboard">
      <div className="mt-2 glass rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-emergency flex items-center justify-center"><FileText className="h-6 w-6 text-white" /></div>
          <div>
            <p className="font-semibold">New Incident Report</p>
            <p className="text-xs text-muted-foreground">Auto-filed to authorities & insurance</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Field label="What happened?">
            <textarea rows={3} placeholder="Describe the incident…" className="w-full bg-transparent outline-none text-sm resize-none" />
          </Field>
          <Field label="Location">
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-cyan-glow" /> OMR · Thoraipakkam Bridge</div>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            {["Minor", "Serious", "Critical"].map((s, i) => (
              <button key={s} className={`py-3 rounded-2xl text-sm font-medium ${i === 1 ? "bg-gradient-emergency text-white glow-red" : "glass-strong"}`}>{s}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-4 rounded-2xl glass-strong flex flex-col items-center gap-2"><Camera className="h-5 w-5 text-cyan-glow" /><span className="text-xs">Add Photos</span></button>
            <button className="py-4 rounded-2xl glass-strong flex flex-col items-center gap-2"><Mic className="h-5 w-5 text-cyan-glow" /><span className="text-xs">Voice Note</span></button>
          </div>
        </div>
      </div>

      <button className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-ai glow-blue font-semibold text-white">Submit Report</button>
    </MobileShell>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="glass-strong rounded-2xl p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}
