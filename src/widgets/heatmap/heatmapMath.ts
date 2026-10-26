/**
 * Osthelia-Widgets — heatmapMath
 *
 * Pure heatmap math: density grid, blur and color ramp.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

export type Point = { x: number; y: number };

// Density is a 2D histogram on a coarse grid, blurred a few passes, then colored
// relative to the busiest cell, so the look doesn't depend on the dataset size.
export const GRID_SIZE = 160;
export const NOISE_FLOOR = 0.015; // below this share of the busiest cell, a cell is a stray point and hidden
export const CONTRAST_GAMMA = 0.5; // lifts secondary zones without touching the peak
export const DEFAULT_COLOR = "2a78d6";

export type Rgb = [number, number, number];
export type RampStop = { stop: number; rgb: Rgb; alpha: number };

export function hexToRgb(hex: string): Rgb | null {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixToward(rgb: Rgb, target: Rgb, t: number): Rgb {
  return rgb.map((c, i) => c + (target[i]! - c) * t) as Rgb;
}

export function buildRamp(baseHex: string): RampStop[] {
  const base = hexToRgb(baseHex) ?? hexToRgb(DEFAULT_COLOR)!;
  const white: Rgb = [255, 255, 255];
  const black: Rgb = [0, 0, 0];
  return [
    { stop: 0, rgb: mixToward(base, white, 0.82), alpha: 0 },
    { stop: 0.15, rgb: mixToward(base, white, 0.62), alpha: 0.25 },
    { stop: 0.35, rgb: mixToward(base, white, 0.32), alpha: 0.45 },
    { stop: 0.55, rgb: base, alpha: 0.65 },
    { stop: 0.75, rgb: mixToward(base, black, 0.25), alpha: 0.8 },
    { stop: 1, rgb: mixToward(base, black, 0.55), alpha: 0.92 },
  ];
}

export function rampColor(ramp: RampStop[], t: number) {
  t = Math.max(0, Math.min(1, t));
  let lower = ramp[0]!;
  let upper = ramp[ramp.length - 1]!;
  for (let i = 0; i < ramp.length - 1; i++) {
    if (t >= ramp[i]!.stop && t <= ramp[i + 1]!.stop) {
      lower = ramp[i]!;
      upper = ramp[i + 1]!;
      break;
    }
  }
  const local = (t - lower.stop) / (upper.stop - lower.stop || 1);
  return {
    r: lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * local,
    g: lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * local,
    b: lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * local,
    a: lower.alpha + (upper.alpha - lower.alpha) * local,
  };
}

// Separable box blur, a cheap stand-in for a gaussian one.
export function boxBlur(grid: Float32Array, size: number, radius: number): Float32Array {
  const pass = (src: Float32Array, horizontal: boolean) => {
    const out = new Float32Array(src.length);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let sum = 0;
        let count = 0;
        for (let d = -radius; d <= radius; d++) {
          const nx = horizontal ? x + d : x;
          const ny = horizontal ? y : y + d;
          if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
          sum += src[ny * size + nx]!;
          count++;
        }
        out[y * size + x] = sum / count;
      }
    }
    return out;
  };
  return pass(pass(grid, true), false);
}

export function buildDensityGrid(positions: Point[]): Float32Array {
  let density: Float32Array = new Float32Array(GRID_SIZE * GRID_SIZE);
  for (const point of positions) {
    const gx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(point.x * GRID_SIZE)));
    const gy = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(point.y * GRID_SIZE)));
    density[gy * GRID_SIZE + gx]! += 1;
  }
  for (let pass = 0; pass < 4; pass++) density = boxBlur(density, GRID_SIZE, 1);
  return density;
}
