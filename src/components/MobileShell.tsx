import { ReactNode, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { FloatingChatbot } from "./FloatingChatbot";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { isVerified, recordAppUsage } from "@/lib/offline";

export function MobileShell({
  children,
  title,
  back,
  hideNav,
  actions,
}: {
  children: ReactNode;
  title?: string;
  back?: string;
  hideNav?: boolean;
  actions?: ReactNode;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isVerified()) {
      navigate({ to: "/signup", replace: true });
      return;
    }
    recordAppUsage();
  }, [navigate]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-ai/20 animate-glow" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-glow/15 animate-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-emergency/10 animate-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {(title || back || actions) && (
          <header className="sticky top-0 z-30 px-4 pt-4 pb-3">
            <div className="glass rounded-2xl flex items-center gap-3 px-3 py-3">
              {back && (
                <Link to={back} className="flex h-9 w-9 items-center justify-center rounded-xl glass-strong">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              )}
              {title && <h1 className="flex-1 text-base font-semibold tracking-tight">{title}</h1>}
              {actions}
            </div>
          </header>
        )}
        <main className={`flex-1 px-4 ${hideNav ? "pb-6" : "pb-32"} animate-fade-up`}>{children}</main>
        {!hideNav && <BottomNav />}
        {!hideNav && <FloatingChatbot />}
      </div>
    </div>
  );
}
