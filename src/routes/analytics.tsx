import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { format, startOfDay, subDays, subMonths, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, BarChart3, Globe2, ArrowTrendingUp, PieChart as PieChartIcon, Timer, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/analytics")({
  ssr: false,
  head: () => ({ meta: [{ title: "Analytics — SOLENA" }, { name: "robots", content: "noindex" }] }),
  component: AnalyticsDashboard,
});

const RANGE_OPTIONS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "180d": 180,
  "365d": 365,
} as const;

const COLORS = ["#c9a574", "#e8e4dd", "#8a7355", "#5a5048", "#3a3530", "#d4b175", "#b09563"];

function getHost(referrer: string | null) {
  if (!referrer) return "direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "other";
  }
}

function formatCount(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function AnalyticsDashboard() {
  const [range, setRange] = useState<keyof typeof RANGE_OPTIONS>("30d");
  const days = RANGE_OPTIONS[range];
  const since = useMemo(() => subDays(new Date(), days).toISOString(), [days]);

  const pageViewsQuery = useQuery({
    queryKey: ["analytics", "page_views", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select(
          "path,referrer,device,browser,os,country,utm_source,utm_medium,utm_campaign,utm_term,utm_content,session_id,created_at"
        )
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Array<Record<string, any>>;
    },
    refetchInterval: 30000,
  });

  const eventsQuery = useQuery({
    queryKey: ["analytics", "events", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_events")
        .select("event_name,path,properties,session_id,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Array<Record<string, any>>;
    },
    refetchInterval: 30000,
  });

  const viewRows = pageViewsQuery.data ?? [];
  const eventRows = eventsQuery.data ?? [];

  const sessions = useMemo(() => {
    const unique = new Set<string>();
    viewRows.forEach((row) => {
      if (row.session_id) unique.add(row.session_id);
    });
    return unique.size;
  }, [viewRows]);

  const paths = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.path, (map.get(row.path) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([path, count]) => ({ path, count }));
  }, [viewRows]);

  const referrers = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => {
      const host = getHost(row.referrer);
      map.set(host, (map.get(host) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));
  }, [viewRows]);

  const browsers = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.browser || "Other", (map.get(row.browser || "Other") ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [viewRows]);

  const oss = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.os || "Other", (map.get(row.os || "Other") ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [viewRows]);

  const countries = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.country || "Unknown", (map.get(row.country || "Unknown") ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count }));
  }, [viewRows]);

  const utmSources = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.utm_source || "none", (map.get(row.utm_source || "none") ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count }));
  }, [viewRows]);

  const utmCampaigns = useMemo(() => {
    const map = new Map<string, number>();
    viewRows.forEach((row) => map.set(row.utm_campaign || "none", (map.get(row.utm_campaign || "none") ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([campaign, count]) => ({ campaign, count }));
  }, [viewRows]);

  const eventCounts = useMemo(() => {
    const map = new Map<string, number>();
    eventRows.forEach((row) => map.set(row.event_name, (map.get(row.event_name) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([event_name, count]) => ({ event_name, count }));
  }, [eventRows]);

  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const series = useMemo(() => {
    const bucket = new Map<string, { date: string; views: number; sessions: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const date = format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd");
      bucket.set(date, { date, views: 0, sessions: new Set() });
    }
    viewRows.forEach((row) => {
      const date = format(startOfDay(new Date(row.created_at)), "yyyy-MM-dd");
      const entry = bucket.get(date);
      if (entry) {
        entry.views += 1;
        if (row.session_id) entry.sessions.add(row.session_id);
      }
    });
    return Array.from(bucket.values()).map((entry) => ({ date: entry.date.slice(5), views: entry.views, sessions: entry.sessions.size }));
  }, [viewRows, days]);

  const timeline = useMemo(() => {
    if (days <= 30) return series;
    const map = new Map<string, { label: string; views: number }>();
    let cursor = startOfDay(subDays(new Date(), days - 1));
    while (cursor <= new Date()) {
      const label = format(cursor, days <= 90 ? "yyyy-MM-dd" : days <= 180 ? "MMM d" : "MMM yyyy");
      map.set(label, { label, views: 0 });
      cursor = addDays(cursor, days <= 90 ? 7 : 30);
    }
    series.forEach((item) => {
      const date = new Date(`${new Date().getFullYear()}-${item.date}`);
      const label = days <= 90 ? format(startOfDay(date), "yyyy-MM-dd") : days <= 180 ? format(startOfDay(date), "MMM d") : format(date, "MMM yyyy");
      const bucket = map.get(label);
      if (bucket) bucket.views += item.views;
    });
    return Array.from(map.values());
  }, [series, days]);

  const realtimeCounts = useMemo(() => {
    const now = Date.now();
    const last5 = viewRows.filter((row) => now - new Date(row.created_at).getTime() <= 5 * 60 * 1000).length;
    const last15 = viewRows.filter((row) => now - new Date(row.created_at).getTime() <= 15 * 60 * 1000).length;
    const last60 = viewRows.filter((row) => now - new Date(row.created_at).getTime() <= 60 * 60 * 1000).length;
    const canvasClicks = eventRows.filter((row) => row.event_name === "canvas_click").length;
    return { last5, last15, last60, canvasClicks };
  }, [viewRows, eventRows]);

  const totalViews = viewRows.length;
  const avgViews = sessions ? (totalViews / sessions).toFixed(1) : "0";
  const uniquePages = new Set(viewRows.map((row) => row.path)).size;
  const referrerDirect = referrers.find((item) => item.referrer === "direct")?.count ?? 0;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Analytics</p>
          <h1 className="mt-2 font-display text-4xl font-extralight text-ivory">Deep Web Intelligence</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone/60">Unified site analytics across page views, referrers, UTM tracking, device signals and external Canvas behavior.</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded border border-ivory/10 bg-obsidian/90 p-2">
          {(Object.keys(RANGE_OPTIONS) as Array<keyof typeof RANGE_OPTIONS>).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded px-3 py-2 text-xs uppercase tracking-[0.35em] transition ${range === key ? "bg-bronze text-obsidian" : "text-stone/60 hover:bg-ivory/5 hover:text-ivory"}`}
            >
              {key}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass p-6">
          <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"> <ArrowTrendingUp size={14} /> Total visits</div>
          <p className="mt-4 text-4xl font-display text-ivory">{formatCount(totalViews)}</p>
          <p className="mt-2 text-sm text-stone/60">{range} site visits</p>
        </div>
        <div className="glass p-6">
          <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"> <Sparkles size={14} /> Unique sessions</div>
          <p className="mt-4 text-4xl font-display text-ivory">{formatCount(sessions)}</p>
          <p className="mt-2 text-sm text-stone/60">Session-based users</p>
        </div>
        <div className="glass p-6">
          <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"> <BarChart3 size={14} /> Pages</div>
          <p className="mt-4 text-4xl font-display text-ivory">{formatCount(uniquePages)}</p>
          <p className="mt-2 text-sm text-stone/60">Unique page URLs tracked</p>
        </div>
        <div className="glass p-6">
          <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"> <Timer size={14} /> Avg views / session</div>
          <p className="mt-4 text-4xl font-display text-ivory">{avgViews}</p>
          <p className="mt-2 text-sm text-stone/60">Depth of engagement</p>
        </div>
      </div>

      <div className="glass p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Traffic trend</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="#ffffff15" />
              <XAxis dataKey="date" stroke="#ffffff70" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff70" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0c0b0a", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12 }} />
              <Line type="monotone" dataKey="views" stroke="#c9a574" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sessions" stroke="#e8e4dd" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass p-6">
              <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]">Real time</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded border border-ivory/10 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-stone/60">Last 5m</p>
                  <p className="mt-2 text-2xl font-display text-ivory">{formatCount(realtimeCounts.last5)}</p>
                </div>
                <div className="rounded border border-ivory/10 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-stone/60">Last 15m</p>
                  <p className="mt-2 text-2xl font-display text-ivory">{formatCount(realtimeCounts.last15)}</p>
                </div>
                <div className="rounded border border-ivory/10 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-stone/60">Last 60m</p>
                  <p className="mt-2 text-2xl font-display text-ivory">{formatCount(realtimeCounts.last60)}</p>
                </div>
              </div>
            </div>
            <div className="glass p-6">
              <div className="flex items-center gap-3 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]">Canvas extension</div>
              <p className="mt-4 text-4xl font-display text-ivory">{formatCount(realtimeCounts.canvasClicks)}</p>
              <p className="mt-2 text-sm text-stone/60">Clicks to external Canvas page</p>
            </div>
          </div>

          <div className="glass grid gap-4 p-6 md:grid-cols-2">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top pages</p>
              <ol className="mt-4 space-y-2">
                {paths.map((item, index) => (
                  <li key={item.path} className="flex items-center justify-between rounded border border-ivory/10 px-3 py-2 text-sm text-ivory">
                    <span className="truncate">{index + 1}. {item.path}</span>
                    <span className="text-stone/60">{item.count}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Top referrers</p>
              <ol className="mt-4 space-y-2">
                {referrers.map((item, index) => (
                  <li key={item.referrer} className="flex items-center justify-between rounded border border-ivory/10 px-3 py-2 text-sm text-ivory">
                    <span className="truncate">{index + 1}. {item.referrer}</span>
                    <span className="text-stone/60">{item.count}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="glass p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Event signal</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {eventCounts.map((item) => (
                <div key={item.event_name} className="rounded border border-ivory/10 p-4 text-sm text-ivory">
                  <p className="font-medium">{item.event_name}</p>
                  <p className="mt-2 text-2xl font-display text-ivory">{formatCount(item.count)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass p-6">
            <div className="flex items-center gap-2 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"><Globe2 size={14} /> Geography</div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={countries} dataKey="count" nameKey="country" innerRadius={40} outerRadius={80} paddingAngle={4}>
                    {countries.map((entry, index) => (
                      <Cell key={entry.country} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11, color: "#ddd" }} />
                  <Tooltip contentStyle={{ background: "#0c0b0a", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass p-6">
            <div className="flex items-center gap-2 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]"><PieChartIcon size={14} /> Sources</div>
            <div className="mt-5 grid gap-3">
              {utmSources.map((item) => (
                <div key={item.source} className="flex items-center justify-between rounded border border-ivory/10 px-3 py-2 text-sm text-ivory">
                  <span className="truncate">{item.source}</span>
                  <span className="text-stone/60">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-6">
            <div className="flex items-center gap-2 text-stone/50 uppercase tracking-[0.35em] text-[0.65rem]">Browser & OS</div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...browsers, ...oss].slice(0, 10)}>
                  <CartesianGrid stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff70" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#ffffff70" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0c0b0a", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#c9a574" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
