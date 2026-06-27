import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminOverview,
});

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="glass p-6">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">{label}</p>
      <p className="mt-3 font-display text-4xl font-extralight text-ivory">{value}</p>
      {hint && <p className="mt-2 text-xs text-stone/60">{hint}</p>}
    </div>
  );
}

function AdminOverview() {
  const since = subDays(new Date(), 30).toISOString();

  const stats = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [pv, pv7, subs, subsNew, users] = await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", subDays(new Date(), 7).toISOString()),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      return {
        views30: pv.count ?? 0,
        views7: pv7.count ?? 0,
        submissions: subs.count ?? 0,
        submissionsNew: subsNew.count ?? 0,
        users: users.count ?? 0,
      };
    },
  });

  const series = useQuery({
    queryKey: ["admin-overview-series"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_views")
        .select("created_at, session_id")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      const buckets = new Map<string, { date: string; views: number; sessions: Set<string> }>();
      for (let i = 29; i >= 0; i--) {
        const d = format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd");
        buckets.set(d, { date: d, views: 0, sessions: new Set() });
      }
      (data ?? []).forEach((r) => {
        const d = format(startOfDay(new Date(r.created_at as string)), "yyyy-MM-dd");
        const b = buckets.get(d);
        if (b) {
          b.views++;
          if (r.session_id) b.sessions.add(r.session_id as string);
        }
      });
      return Array.from(buckets.values()).map((b) => ({ date: b.date.slice(5), views: b.views, visitors: b.sessions.size }));
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Overview</p>
        <h1 className="mt-2 font-display text-4xl font-extralight text-ivory">Mission Control</h1>
        <p className="mt-1 text-sm text-stone/60">Last 30 days · live data from your deployment</p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <StatCard label="Views · 30d" value={stats.data?.views30 ?? "—"} />
        <StatCard label="Views · 7d" value={stats.data?.views7 ?? "—"} />
        <StatCard label="Submissions" value={stats.data?.submissions ?? "—"} hint={`${stats.data?.submissionsNew ?? 0} new`} />
        <StatCard label="Accounts" value={stats.data?.users ?? "—"} />
        <StatCard label="Sessions · 30d" value={series.data?.reduce((s, d) => s + d.visitors, 0) ?? "—"} />
      </div>

      <div className="glass p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Traffic · last 30 days</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.data ?? []}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#ffffff60" fontSize={11} />
              <YAxis stroke="#ffffff60" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #ffffff20", fontSize: 12 }} />
              <Line type="monotone" dataKey="views" stroke="#c9a574" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="visitors" stroke="#e8e4dd" strokeWidth={1} dot={false} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
