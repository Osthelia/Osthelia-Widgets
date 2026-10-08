/**
 * Osthelia-Widgets — useWidgetData
 *
 * Hook fetching a widget's data from the GC Stats API, with timeout, validation and optional auto refresh.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { useEffect, useState } from "react";
import { GCS_API_URL } from "./config";

export type WidgetState<T> = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

const REQUEST_TIMEOUT_MS = 15_000;
const MIN_REFRESH_SECONDS = 10;
/** Params handled by this front only, not forwarded to the API (keeps the API cache keys clean). */
const FRONT_ONLY_PARAMS = ["lang", "credit", "refresh", "rotation"];

function apiQuery(params: URLSearchParams): string {
  const forwarded = new URLSearchParams(params);
  for (const name of FRONT_ONLY_PARAMS) forwarded.delete(name);
  const query = forwarded.toString();
  return query ? `?${query}` : "";
}

/** `?refresh=<seconds>` re-fetches periodically (min 10s). Off by default. */
function refreshInterval(params: URLSearchParams): number | null {
  const seconds = Number(params.get("refresh"));
  return Number.isFinite(seconds) && seconds > 0 ? Math.max(seconds, MIN_REFRESH_SECONDS) * 1000 : null;
}

/**
 * Fetches `/api/widgets/<endpoint>` with the widget's own query string (filters are forwarded, front only params removed).
 * `isValid` guards the shape of the response so a malformed payload becomes an error state instead of a render crash.
 */
export function useWidgetData<T>(endpoint: string, isValid: (body: unknown) => body is T): WidgetState<T> {
  const [state, setState] = useState<WidgetState<T>>({ status: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = `${GCS_API_URL}/api/widgets/${endpoint}${apiQuery(params)}`;
    let cancelled = false;
    let controller: AbortController | undefined;

    const load = async () => {
      controller = new AbortController();
      const timer = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(url, { signal: controller.signal });
        const body: unknown = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body as { error?: string } | null)?.error ?? `HTTP ${res.status}`);
        if (!isValid(body)) throw new Error("Invalid response");
        if (!cancelled) setState({ status: "ready", data: body });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        // A failed refresh keeps showing the last good data.
        setState((prev) => (prev.status === "ready" ? prev : { status: "error", message }));
      } finally {
        clearTimeout(timer);
      }
    };

    void load();
    const every = refreshInterval(params);
    const interval = every ? setInterval(() => void load(), every) : undefined;
    return () => {
      cancelled = true;
      controller?.abort();
      if (interval) clearInterval(interval);
    };
  }, [endpoint, isValid]);

  return state;
}
