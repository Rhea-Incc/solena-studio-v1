import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/submissions")({
  ssr: false,
  component: SubmissionsPage,
});

type Submission = {
  id: string;
  name: string;
  organization: string | null;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

function SubmissionsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const list = useQuery({
    queryKey: ["submissions", filter],
    queryFn: async () => {
      let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Submission[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Updated");
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      setSelected(null);
      toast.success("Deleted");
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Inbox</p>
          <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Contact Submissions</h1>
        </div>
        <div className="flex gap-1 rounded border border-ivory/10 p-1 text-[0.65rem] uppercase tracking-[0.3em]">
          {(["all", "new", "read", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-1.5 ${filter === f ? "bg-ivory/10 text-ivory" : "text-stone/60 hover:text-ivory"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="glass overflow-hidden">
        {list.isLoading ? (
          <div className="p-10 text-center text-sm text-stone/60">Loading…</div>
        ) : !list.data?.length ? (
          <div className="p-10 text-center text-sm text-stone/60">No submissions yet.</div>
        ) : (
          <div className="divide-y divide-ivory/5">
            {list.data.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelected(s);
                  if (s.status === "new") update.mutate({ id: s.id, status: "read" });
                }}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-ivory/5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    {s.status === "new" && <span className="h-1.5 w-1.5 rounded-full bg-bronze-glow" />}
                    <p className="truncate font-display text-base text-ivory">{s.name}</p>
                    <p className="truncate text-xs text-stone/60">{s.email}</p>
                  </div>
                  <p className="mt-1 truncate text-sm text-stone/70">{s.message}</p>
                </div>
                <p className="shrink-0 text-[0.65rem] uppercase tracking-[0.3em] text-stone/50">
                  {format(new Date(s.created_at), "MMM d")}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur" onClick={() => setSelected(null)}>
          <div className="glass max-h-[85vh] w-full max-w-2xl overflow-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-ivory">{selected.name}</h2>
                <p className="mt-1 text-sm text-stone/70">{selected.email}</p>
                {selected.organization && <p className="text-sm text-stone/70">{selected.organization}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-stone/60 hover:text-ivory">✕</button>
            </div>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-stone/50">
              {format(new Date(selected.created_at), "PPpp")}
            </p>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-stone/85">{selected.message}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href={`mailto:${selected.email}`} className="border border-ivory/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-ivory hover:border-bronze-glow hover:text-bronze-glow">Reply</a>
              <button onClick={() => update.mutate({ id: selected.id, status: "archived" })} className="border border-ivory/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone/70 hover:text-ivory">Archive</button>
              <button onClick={() => { if (confirm("Delete this submission?")) del.mutate(selected.id); }} className="ml-auto border border-red-500/30 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-300 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
