import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { format, startOfDay, subDays } from "date-fns";

export const Route = createFileRoute("/admin/analytics")({
  ssr: false,
  component: AnalyticsPage,
});

const RANGES = { "7d": 7, "30d": 30, "90d": 90 } as const;
type RangeKey = keyof typeof RANGES;

const COLORS = ["#c9a574", "#e8e4dd", "#8a7355", "#5a5048", "#3a3530"];

function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const days = RANGES[range];
  const since = subDays(new Date(), days).toISOString();

  const data = useQuery({
    queryKey: ["analytics", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("path, referrer, device, session_id, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = data.data ?? [];

  // daily series
  const dailyMap = new Map<string, { date: string; views: number; sessions: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd");
    dailyMap.set(d, { date: d, views: 0, sessions: new Set() });
  }
  rows.forEach((r) => {
    const d = format(startOfDay(new Date(r.created_at as string)), "yyyy-MM-dd");
    const b = dailyMap.get(d);
    if (b) {
      b.views++;
      if (r.session_id) b.sessions.add(r.session_id as string);
    }
  });
  const daily = Array.from(dailyMap.values()).map((b) => ({ date: b.date.slice(5), views: b.views, visitors: b.sessions.size }));

  // top paths
  const pathMap = new Map<string, number>();
  rows.forEach((r) => pathMap.set(r.path as string, (pathMap.get(r.path as string) ?? 0) + 1));
  const topPaths = Array.from(pathMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count }));

  // devices
  const deviceMap = new Map<string, number>();
  rows.forEach((r) => deviceMap.set((r.device as string) || "unknown", (deviceMap.get((r.device as string) || "unknown") ?? 0) + 1));
  const devices = Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value }));

  // referrers
  const refMap = new Map<string, number>();
  rows.forEach((r) => {
    const ref = r.referrer as string | null;
    if (!ref) return refMap.set("direct", (refMap.get("direct") ?? 0) + 1);
    try {
      const host = new URL(ref).hostname;
      refMap.set(host, (refMap.get(host) ?? 0) + 1);
    } catch {
      refMap.set("direct", (refMap.get("direct") ?? 0) + 1);
    }
  });
  const referrers = Array.from(refMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count }));

  const totalViews = rows.length;
  const totalSessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Analytics</p>
          <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Traffic & Engagement</h1>
        </div>
        <div className="flex gap-1 rounded border border-ivory/10 p-1 text-[0.65rem] uppercase tracking-[0.3em]">
          {(Object.keys(RANGES) as RangeKey[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`rounded px-3 py-1.5 ${range === r ? "bg-ivory/10 text-ivory" : "text-stone/60 hover:text-ivory"}`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Total views</p><p className="mt-2 font-display text-3xl text-ivory">{totalViews}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Sessions</p><p className="mt-2 font-display text-3xl text-ivory">{totalSessions}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Views / session</p><p className="mt-2 font-display text-3xl text-ivory">{totalSessions ? (totalViews / totalSessions).toFixed(1) : "—"}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top page</p><p className="mt-2 truncate font-display text-lg text-ivory">{topPaths[0]?.path ?? "—"}</p></div>
      </div>

      <div className="glass p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Daily traffic</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#ffffff60" fontSize={11} />
              <YAxis stroke="#ffffff60" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #ffffff20", fontSize: 12 }} />
              <Bar dataKey="views" fill="#c9a574" />
              <Bar dataKey="visitors" fill="#e8e4dd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top pages</p>
          <ul className="mt-4 space-y-2">
            {topPaths.length === 0 && <li className="text-sm text-stone/60">No data yet.</li>}
            {topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-ivory">{p.path}</span>
                <span className="shrink-0 text-stone/60">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Devices</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45}>
                  {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #ffffff20", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 lg:col-span-2">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top referrers</p>
          <ul className="mt-4 space-y-2">
            {referrers.length === 0 && <li className="text-sm text-stone/60">No data yet.</li>}
            {referrers.map((r) => (
              <li key={r.source} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-ivory">{r.source}</span>
                <span className="shrink-0 text-stone/60">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
