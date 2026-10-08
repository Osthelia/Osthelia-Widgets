/**
 * Osthelia-Widgets — main
 *
 * Entry point: picks the widget matching the current URL path and mounts it, or shows the widget index.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader } from "./components/WidgetFrame";
import { WIDGETS } from "./widgets/registry";
import "./theme.css";

// Works when hosted under a sub-path (see VITE_BASE).
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const path = window.location.pathname.slice(base.length).replace(/\/$/, "");
const Widget = WIDGETS[path];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {Widget ? (
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Widget />
        </Suspense>
      </ErrorBoundary>
    ) : (
      <nav className="index">
        <h1>GC Stats Widgets</h1>
        <ul>
          {Object.keys(WIDGETS).map((route) => (
            <li key={route}>
              <a href={`${base}${route}`}>{route}</a>
            </li>
          ))}
        </ul>
      </nav>
    )}
  </StrictMode>,
);
