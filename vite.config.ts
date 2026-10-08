/**
 * Osthelia-Widgets — vite.config
 *
 * Vite build configuration.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // A production build without the API URL would silently call localhost: fail early instead.
  if (mode === "production" && !env.VITE_GCS_API_URL) {
    throw new Error("VITE_GCS_API_URL is required for a production build (see .env.example).");
  }
  return { base: env.VITE_BASE || "/", plugins: [react()] };
});
