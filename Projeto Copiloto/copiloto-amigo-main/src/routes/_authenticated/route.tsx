import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isAuthBypassEnabled, isDemoModeEnabled } from "@/lib/runtime-mode";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (isDemoModeEnabled() || isAuthBypassEnabled()) {
      return {
        user: {
          id: isDemoModeEnabled() ? "demo-user" : "public-user",
          email: isDemoModeEnabled() ? "demo@copilotol1.local" : "public@copilotol1.local",
        },
      };
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
