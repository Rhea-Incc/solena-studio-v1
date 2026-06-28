import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { format, startOfDay, subDays } from "date-fns";
import { X } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  ssr: false,
  component: AnalyticsPage,
});

const RANGES = { "7d": 7, "30d": 30, "90d": 90 } as const;
type RangeKey = keyof typeof RANGES;
const COLORS = ["#c9a574", "#e8e4dd", "#8a7355", "#5a5048", "#3a3530"];

type Filter = { type: "path" | "device" | "referrer"; value: string } | null;

type Row = {
  path: string;
  referrer: string | null;
  device: string | null;
  session_id: string | null;
  created_at: string;
};

function refHost(r: string | null): string {
  if (!r) return "direct";
  try { return new URL(r).hostname; } catch { return "direct"; }
}

function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [filter, setFilter] = useState<Filter>(null);
  const days = RANGES[range];
  const since = useMemo(() => subDays(new Date(), days).toISOString(), [days]);

  const data = useQuery({
    queryKey: ["analytics", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("path, referrer, device, session_id, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const all = data.data ?? [];
  const rows = useMemo(() => {
    if (!filter) return all;
    return all.filter((r) => {
      if (filter.type === "path") return r.path === filter.value;
      if (filter.type === "device") return (r.device ?? "unknown") === filter.value;
      if (filter.type === "referrer") return refHost(r.referrer) === filter.value;
      return true;
    });
  }, [all, filter]);

  // daily series
  const daily = useMemo(() => {
    const m = new Map<string, { date: string; views: number; sessions: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd");
      m.set(d, { date: d, views: 0, sessions: new Set() });
    }
    rows.forEach((r) => {
      const d = format(startOfDay(new Date(r.created_at)), "yyyy-MM-dd");
      const b = m.get(d);
      if (b) { b.views++; if (r.session_id) b.sessions.add(r.session_id); }
    });
    return Array.from(m.values()).map((b) => ({ date: b.date.slice(5), views: b.views, visitors: b.sessions.size }));
  }, [rows, days]);

  const topPaths = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.path, (m.get(r.path) ?? 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count }));
  }, [rows]);

  const devices = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.device || "unknown", (m.get(r.device || "unknown") ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const referrers = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(refHost(r.referrer), (m.get(refHost(r.referrer)) ?? 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count }));
  }, [rows]);

  const totalViews = rows.length;
  const totalSessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;

  const filterLabel = filter
    ? filter.type === "path" ? `Page: ${filter.value}`
      : filter.type === "device" ? `Device: ${filter.value}`
      : `Referrer: ${filter.value}`
    : null;

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

      {filter && (
        <div className="flex items-center justify-between gap-4 rounded border border-bronze-glow/40 bg-bronze-glow/5 px-4 py-3">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-bronze-glow">Drill-down active</p>
            <p className="mt-1 font-display text-sm text-ivory">{filterLabel}</p>
          </div>
          <button onClick={() => setFilter(null)} className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-stone/70 hover:text-ivory">
            <X size={13} /> Clear
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">{filter ? "Filtered views" : "Total views"}</p><p className="mt-2 font-display text-3xl text-ivory">{totalViews}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Sessions</p><p className="mt-2 font-display text-3xl text-ivory">{totalSessions}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Views / session</p><p className="mt-2 font-display text-3xl text-ivory">{totalSessions ? (totalViews / totalSessions).toFixed(1) : "—"}</p></div>
        <div className="glass p-5"><p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top page</p><p className="mt-2 truncate font-display text-lg text-ivory">{topPaths[0]?.path ?? "—"}</p></div>
      </div>

      <div className="glass p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Daily traffic{filter ? " (filtered)" : ""}</p>
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
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top pages · click to filter</p>
          <ul className="mt-4 space-y-1">
            {topPaths.length === 0 && <li className="text-sm text-stone/60">No data yet.</li>}
            {topPaths.map((p) => {
              const active = filter?.type === "path" && filter.value === p.path;
              return (
                <li key={p.path}>
                  <button
                    onClick={() => setFilter(active ? null : { type: "path", value: p.path })}
                    className={`flex w-full items-center justify-between gap-4 rounded px-3 py-2 text-left text-sm transition-colors ${active ? "bg-bronze-glow/10 text-bronze-glow" : "hover:bg-ivory/5 text-ivory"}`}
                  >
                    <span className="truncate">{p.path}</span>
                    <span className="shrink-0 text-stone/60">{p.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Devices · click slice to filter</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devices}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={45}
                  onClick={(d: { name?: string }) => {
                    if (!d?.name) return;
                    setFilter((f) => (f?.type === "device" && f.value === d.name ? null : { type: "device", value: d.name! }));
                  }}
                  cursor="pointer"
                >
                  {devices.map((d, i) => {
                    const active = filter?.type === "device" && filter.value === d.name;
                    return <Cell key={i} fill={COLORS[i % COLORS.length]} stroke={active ? "#e8e4dd" : "transparent"} strokeWidth={active ? 2 : 0} />;
                  })}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #ffffff20", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 lg:col-span-2">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top referrers · click to filter</p>
          <ul className="mt-4 space-y-1">
            {referrers.length === 0 && <li className="text-sm text-stone/60">No data yet.</li>}
            {referrers.map((r) => {
              const active = filter?.type === "referrer" && filter.value === r.source;
              return (
                <li key={r.source}>
                  <button
                    onClick={() => setFilter(active ? null : { type: "referrer", value: r.source })}
                    className={`flex w-full items-center justify-between gap-4 rounded px-3 py-2 text-left text-sm transition-colors ${active ? "bg-bronze-glow/10 text-bronze-glow" : "hover:bg-ivory/5 text-ivory"}`}
                  >
                    <span className="truncate">{r.source}</span>
                    <span className="shrink-0 text-stone/60">{r.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
