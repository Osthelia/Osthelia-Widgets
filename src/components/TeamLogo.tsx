/**
 * Osthelia-Widgets — TeamLogo
 *
 * Team logo with a fallback on the team initials.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { useState } from "react";

/** Team logo, falls back to the team initials when the image is missing or broken. */
export function TeamLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  // Remember which URL failed, so a new logoUrl gets a fresh attempt.
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  if (!logoUrl || brokenUrl === logoUrl) {
    return <span className="team-logo team-logo-fallback">{name.slice(0, 2).toUpperCase()}</span>;
  }
  return <img className="team-logo" src={logoUrl} alt="" onError={() => setBrokenUrl(logoUrl)} />;
}
