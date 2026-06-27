import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "solena_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

let lastTrackedPath = "";

async function logPageView(path: string) {
  if (typeof window === "undefined") return;
  if (path === lastTrackedPath) return;
  if (path.startsWith("/admin") || path.startsWith("/auth")) return;
  lastTrackedPath = path;
  try {
    await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      device: detectDevice(),
      user_agent: navigator.userAgent.slice(0, 500),
    });
  } catch {
    /* silent */
  }
}

export function useTrackPageViews() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    void logPageView(pathname);
  }, [pathname]);
}
