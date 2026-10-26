/**
 * Osthelia-Widgets — ErrorBoundary
 *
 * Catches render errors so a widget shows a message instead of a blank page.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { Component, type ReactNode } from "react";
import { t } from "../i18n";

/** Catches render errors so an OBS source shows a message instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[widget]", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="widget widget-center">
        <p className="message">{t("error")}</p>
      </div>
    );
  }
}
