import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Ambulance, Brain, Users, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const slides = [
  { icon: Ambulance, title: "Every Second Saves a Life", desc: "Smart ambulance dispatch, AI accident detection, and instant emergency support — engineered for the golden hour.", color: "emergency" },
  { icon: Brain, title: "AI Powered Emergency Response", desc: "Real-time crash detection, intelligent hospital routing, and predictive risk alerts powered by on-device AI.", color: "ai" },
  { icon: Users, title: "Your Safety Network", desc: "Family alerts, verified volunteers, and a city-wide rescue ecosystem — always one tap away.", color: "purple" },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const slide = slides[i];
  const Icon = slide.icon;
  const next = () => (i < slides.length - 1 ? setI(i + 1) : navigate({ to: "/signup" }));

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-ai/20 animate-glow" />

      <div className="relative z-10 flex justify-between items-center px-6 pt-6">
        <div className="text-xs tracking-widest text-muted-foreground">{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</div>
        <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">Skip</Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-up" key={i}>
        <div className="relative mb-10">
          <div className={`absolute inset-0 rounded-3xl ${slide.color === "emergency" ? "bg-emergency/30" : slide.color === "ai" ? "bg-ai/30" : "bg-purple-glow/30"} blur-3xl animate-glow`} />
          <div className={`relative h-40 w-40 rounded-3xl glass-strong flex items-center justify-center ${slide.color === "emergency" ? "glow-red" : slide.color === "ai" ? "glow-blue" : ""} animate-float`}>
            <Icon className="h-20 w-20 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-3xl font-bold leading-tight tracking-tight">{slide.title}</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">{slide.desc}</p>
      </div>

      <div className="relative z-10 px-8 pb-10">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gradient-ai" : "w-1.5 bg-muted"}`} />
          ))}
        </div>
        <button onClick={next} className="w-full h-14 rounded-2xl bg-gradient-ai glow-blue flex items-center justify-center gap-2 font-semibold text-white">
          {i < slides.length - 1 ? "Continue" : "Get Started"} <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
