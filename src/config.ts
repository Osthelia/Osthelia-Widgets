/**
 * Osthelia-Widgets — config
 *
 * Configuration (GC Stats API base URL).
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

declare global {
  interface Window {
    /** Set by /config.js, which the nginx image generates from the GCS_API_URL environment variable. */
    __WIDGETS_CONFIG__?: { gcsApiUrl?: string };
  }
}

/** Base URL of the GC Stats site that exposes the widget data endpoints. Runtime value (/config.js) first, then VITE_GCS_API_URL at build time. */
export const GCS_API_URL = (
  window.__WIDGETS_CONFIG__?.gcsApiUrl ||
  import.meta.env.VITE_GCS_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/$/, "");
