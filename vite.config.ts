/**
 * Osthelia-Widgets — vite.config
 *
 * Vite build configuration.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return { base: env.VITE_BASE || "/", plugins: [react()] };
});
