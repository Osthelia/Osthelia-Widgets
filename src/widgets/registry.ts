/**
 * Osthelia-Widgets — registry
 *
 * Registry of the available widgets (URL path to lazy loaded component).
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { lazy, type ComponentType } from "react";

// Lazy so each widget only ships its own dependencies (the heatmap doesn't load the chart library).
/** One entry per widget: URL path to component. To add a widget, create its folder and register it here. */
export const WIDGETS: Record<string, ComponentType> = {
  "/head-to-head": lazy(() => import("./head-to-head/HeadToHead").then((m) => ({ default: m.HeadToHead }))),
  "/heatmap": lazy(() => import("./heatmap/Heatmap").then((m) => ({ default: m.Heatmap }))),
};
