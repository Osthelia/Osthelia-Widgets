/**
 * Osthelia-Widgets — config
 *
 * Build time configuration (GC Stats API base URL).
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

/** Base URL of the GC Stats site that exposes the widget data endpoints (required in production, checked at build time). */
export const GCS_API_URL = (import.meta.env.VITE_GCS_API_URL ?? (import.meta.env.DEV ? "http://localhost:3000" : "")).replace(/\/$/, "");
