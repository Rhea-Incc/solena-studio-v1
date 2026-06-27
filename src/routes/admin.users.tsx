import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: UsersPage,
});

type Profile = { id: string; email: string | null; display_name: string | null; created_at: string };
type Role = "admin" | "editor" | "viewer";

function UsersPage() {
  const qc = useQueryClient();

  const profiles = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const roles = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data as { user_id: string; role: Role }[];
    },
  });

  const grant = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: Role }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id, role });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role granted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const revoke = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: Role }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role revoked");
    },
  });

  const rolesByUser = new Map<string, Set<Role>>();
  (roles.data ?? []).forEach((r) => {
    if (!rolesByUser.has(r.user_id)) rolesByUser.set(r.user_id, new Set());
    rolesByUser.get(r.user_id)!.add(r.role);
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Access</p>
        <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Users & Roles</h1>
        <p className="mt-1 text-sm text-stone/60">Grant or revoke admin, editor, viewer roles.</p>
      </header>

      <div className="glass overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[0.6rem] uppercase tracking-[0.35em] text-stone/50">
            <tr className="border-b border-ivory/10">
              <th className="px-6 py-3 text-left font-normal">User</th>
              <th className="px-6 py-3 text-left font-normal">Joined</th>
              <th className="px-6 py-3 text-left font-normal">Roles</th>
              <th className="px-6 py-3 text-right font-normal">Grant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory/5">
            {profiles.data?.map((p) => {
              const userRoles = rolesByUser.get(p.id) ?? new Set<Role>();
              return (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    <p className="text-ivory">{p.display_name || "—"}</p>
                    <p className="text-xs text-stone/60">{p.email}</p>
                  </td>
                  <td className="px-6 py-4 text-stone/70">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(userRoles).map((r) => (
                        <button
                          key={r}
                          onClick={() => { if (confirm(`Revoke ${r} from ${p.email}?`)) revoke.mutate({ user_id: p.id, role: r }); }}
                          className="border border-bronze/40 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-bronze-glow hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30"
                          title="Click to revoke"
                        >
                          {r} ✕
                        </button>
                      ))}
                      {userRoles.size === 0 && <span className="text-xs text-stone/50">none</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-1">
                      {(["admin", "editor", "viewer"] as Role[]).filter((r) => !userRoles.has(r)).map((r) => (
                        <button
                          key={r}
                          onClick={() => grant.mutate({ user_id: p.id, role: r })}
                          className="border border-ivory/15 px-2 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-stone/70 hover:border-bronze-glow hover:text-bronze-glow"
                        >
                          + {r}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!profiles.data?.length && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-stone/60">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
