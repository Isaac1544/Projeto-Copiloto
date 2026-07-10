import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { isAuthBypassEnabled, isDemoModeEnabled } from "@/lib/runtime-mode";
import { toast } from "sonner";

function traduzirErroAuth(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado. Abra a caixa de entrada e clique no link enviado pelo Supabase.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (normalized.includes("user already registered")) {
    return "Este e-mail já está cadastrado. Tente entrar ou redefinir a senha.";
  }

  return message;
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Copiloto L1" },
      { name: "description", content: "Acesse o Copiloto L1 para começar a analisar chamados." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const demoMode = isDemoModeEnabled();
  const authBypass = isAuthBypassEnabled();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authBypass) {
      navigate({ to: "/" });
      return;
    }
    if (demoMode) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [authBypass, demoMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta!");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Conta criada. Você já pode entrar.");
        setMode("signin");
      }
    } catch (err) {
      const msg = err instanceof Error ? traduzirErroAuth(err.message) : "Falha na autenticação.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Falha ao entrar com Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  if (demoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">Copiloto L1</div>
              <div className="text-xs text-muted-foreground">Assistente do analista de suporte</div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modo demonstração ativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  O app está acessível sem login porque o ambiente Supabase ainda não foi
                  configurado neste frontend. Você já pode navegar pelo MVP, criar atendimentos e
                  registrar decisões localmente.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => navigate({ to: "/" })}>
                Entrar no MVP agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (authBypass) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">Copiloto L1</div>
              <div className="text-xs text-muted-foreground">Assistente do analista de suporte</div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acesso público com backend conectado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  O login foi desativado temporariamente para acelerar o MVP. As análises podem usar
                  o backend real e ficam associadas à sessão atual deste navegador.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => navigate({ to: "/" })}>
                Entrar no MVP agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight">Copiloto L1</div>
            <div className="text-xs text-muted-foreground">Assistente do analista de suporte</div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
              Continuar com Google
            </Button>
            <div className="relative text-center text-xs text-muted-foreground">
              <span className="bg-card px-2 relative z-10">ou com e-mail</span>
              <div className="absolute inset-x-0 top-1/2 -z-0 border-t border-border" />
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  E-mail corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : mode === "signin" ? (
                  "Entrar"
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
            <div className="text-center text-xs text-muted-foreground">
              {mode === "signin" ? (
                <button className="underline" onClick={() => setMode("signup")}>
                  Não tem conta? Criar agora
                </button>
              ) : (
                <button className="underline" onClick={() => setMode("signin")}>
                  Já tem conta? Entrar
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Sugestão gerada por IA. A decisão final é humana.
        </p>
      </div>
    </div>
  );
}
