import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Sign In — SOLENA" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) {
          await supabase.rpc("bootstrap_first_admin");
          toast.success("Account created. Opening admin.");
          navigate({ to: "/admin" });
        } else {
          toast.success("Account created. Confirm your email, then sign in.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.rpc("bootstrap_first_admin");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 block text-center text-xs uppercase tracking-[0.45em] text-stone/60 hover:text-bronze-glow">
          ← Solena
        </Link>
        <div className="glass p-10">
          <h1 className="font-display text-3xl font-extralight tracking-tight text-ivory">
            {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-stone/60">
            Restricted access · Authorized staff only
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-b border-ivory/15 bg-transparent pb-2 font-display text-lg text-ivory focus:border-bronze-glow focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-b border-ivory/15 bg-transparent pb-2 font-display text-lg text-ivory focus:border-bronze-glow focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full border border-ivory/20 py-3 text-xs uppercase tracking-[0.45em] text-ivory transition-colors hover:border-bronze-glow hover:text-bronze-glow disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-xs uppercase tracking-[0.35em] text-stone/60 hover:text-bronze-glow"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
        <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.35em] text-stone/40">
          First staff account is promoted automatically. Later accounts need admin approval.
        </p>
      </div>
    </div>
  );
}
