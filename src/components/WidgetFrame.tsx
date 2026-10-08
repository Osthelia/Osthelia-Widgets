/**
 * Osthelia-Widgets — WidgetFrame
 *
 * Common shell of every widget: loader, error message and optional credit line.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import type { ReactNode } from "react";
import { t } from "../i18n";
import type { WidgetState } from "../useWidgetData";

/** Centered spinner, also used as the Suspense fallback. */
export function Loader() {
  return (
    <div className="widget widget-center" role="status" aria-label={t("loading")}>
      <span className="spinner" />
    </div>
  );
}

/** Credit line, shown only when the URL has `?credit=1` (opt in). */
function Credit() {
  if (new URLSearchParams(window.location.search).get("credit") !== "1") return null;
  return <p className="credit">{t("credit")}</p>;
}

/** Common shell of every widget: loader, error message, then the widget itself and the optional credit. */
export function WidgetFrame<T>({ state, children }: { state: WidgetState<T>; children: (data: T) => ReactNode }) {
  if (state.status === "loading") return <Loader />;
  if (state.status === "error") {
    return (
      <div className="widget widget-center">
        <p className="message" title={state.message}>
          {t("error")}
        </p>
      </div>
    );
  }
  return (
    <div className="widget">
      <div className="widget-body">{children(state.data)}</div>
      <Credit />
    </div>
  );
}
