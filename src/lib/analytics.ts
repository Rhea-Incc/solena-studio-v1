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

function parseOS(userAgent: string): string {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function parseBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\//i.test(userAgent) || /Opera/i.test(userAgent)) return "Opera";
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent) && !/OPR\//i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

function captureUTM() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  };
}

let lastTrackedPath = "";

async function logPageView(path: string) {
  if (typeof window === "undefined") return;
  if (path === lastTrackedPath) return;
  if (path.startsWith("/admin") || path.startsWith("/auth")) return;
  lastTrackedPath = path;

  const userAgent = navigator.userAgent.slice(0, 500);
  try {
    await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      device: detectDevice(),
      user_agent: userAgent,
      os: parseOS(userAgent),
      browser: parseBrowser(userAgent),
      ...captureUTM(),
    });
  } catch {
    /* silent */
  }
}

export async function logCustomEvent(eventName: string, properties?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("custom_events").insert({
      event_name: eventName,
      properties: properties ?? {},
      path: window.location.pathname,
      session_id: getSessionId(),
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
