import { useEffect, useState } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Inbox, BarChart3, Users, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — SOLENA" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type AuthState =
  | { status: "loading" }
  | { status: "unauth" }
  | { status: "forbidden"; email: string }
  | { status: "ok"; email: string };

function AdminLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({ status: "loading" });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let active = true;
    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;
      if (!userData.user) {
        setState({ status: "unauth" });
        navigate({ to: "/auth" });
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      if (!roleData) {
        setState({ status: "forbidden", email: userData.user.email ?? "" });
        return;
      }
      setState({ status: "ok", email: userData.user.email ?? "" });
    }
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/auth" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (state.status === "loading" || state.status === "unauth") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <p className="text-xs uppercase tracking-[0.45em] text-stone/60">Authorizing…</p>
      </div>
    );
  }

  if (state.status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl font-extralight text-ivory">Not authorized</h1>
          <p className="mt-3 text-sm text-stone/70">
            Signed in as <span className="text-ivory">{state.email}</span>. This account has no admin role.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-stone/50">
            Ask an existing admin to grant you access.
          </p>
          <button onClick={signOut} className="mt-8 border border-ivory/20 px-6 py-2 text-xs uppercase tracking-[0.4em] text-ivory hover:border-bronze-glow hover:text-bronze-glow">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/submissions", label: "Submissions", icon: Inbox },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/users", label: "Users & Roles", icon: Users },
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-ivory/10 bg-obsidian/80 p-6 md:block">
          <Link to="/" className="block text-xs uppercase tracking-[0.45em] text-stone/60 hover:text-bronze-glow">
            ← Solena
          </Link>
          <p className="mt-8 text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Admin Console</p>
          <nav className="mt-4 space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = isActive(n.to, n.exact);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                    active ? "bg-ivory/5 text-ivory" : "text-stone/70 hover:bg-ivory/5 hover:text-ivory"
                  }`}
                >
                  <Icon size={15} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-10 border-t border-ivory/10 pt-6">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-stone/40">Signed in</p>
            <p className="mt-1 truncate text-sm text-ivory">{state.email}</p>
            <button onClick={signOut} className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-stone/60 hover:text-bronze-glow">
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile bar */}
        <div className="md:hidden fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-ivory/10 bg-obsidian/95 px-4 py-3 backdrop-blur">
          <Link to="/" className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/70">← Solena</Link>
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ivory">Admin</span>
          <button onClick={signOut} className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/70">Exit</button>
        </div>

        <main className="flex-1 overflow-x-hidden pt-14 md:pt-0">
          <div className="md:hidden border-b border-ivory/10 bg-obsidian/60 px-4 py-2">
            <nav className="flex gap-1 overflow-x-auto">
              {nav.map((n) => {
                const active = isActive(n.to, n.exact);
                return (
                  <Link key={n.to} to={n.to as "/admin"} className={`shrink-0 rounded px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.3em] ${active ? "bg-ivory/10 text-ivory" : "text-stone/60"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-6 md:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
