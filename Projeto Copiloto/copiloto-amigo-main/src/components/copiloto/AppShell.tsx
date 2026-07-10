import { Link, useNavigate } from "@tanstack/react-router";
import { Bot, BookOpen, LayoutDashboard, PlusCircle, History, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { getRuntimeModeLabel, isAuthBypassEnabled, isDemoModeEnabled } from "@/lib/runtime-mode";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/novo-atendimento", label: "Novo atendimento", icon: PlusCircle, exact: false },
  { to: "/base-conhecimento", label: "Base de conhecimento", icon: BookOpen, exact: false },
  { to: "/historico", label: "Histórico", icon: History, exact: false },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const demoMode = isDemoModeEnabled();
  const authBypass = isAuthBypassEnabled();

  useEffect(() => {
    if (demoMode) {
      setEmail("demo@copilotol1.local");
      return;
    }
    if (authBypass) {
      setEmail("public@copilotol1.local");
      return;
    }
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [authBypass, demoMode]);

  const handleLogout = async () => {
    await qc.cancelQueries();
    qc.clear();
    if (demoMode || authBypass) {
      navigate({ to: "/auth", replace: true });
      return;
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold leading-tight">Copiloto L1</div>
              <div className="hidden text-xs text-muted-foreground sm:block">
                Assistente do analista de suporte
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                title={item.label}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground sm:px-3"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
            {email && (
              <span
                className="ml-2 hidden max-w-[180px] truncate text-xs text-muted-foreground lg:inline"
                title={email}
              >
                {demoMode || authBypass ? getRuntimeModeLabel() : email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-1"
              title={demoMode || authBypass ? "Tela de acesso" : "Sair"}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">
                {demoMode || authBypass ? "Acesso" : "Sair"}
              </span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-muted-foreground">
          Sugestão gerada por IA. A decisão final é humana.
        </div>
      </footer>
    </div>
  );
}
