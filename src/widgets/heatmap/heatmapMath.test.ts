/**
 * Osthelia-Widgets — heatmapMath.test
 *
 * Unit tests of the heatmap math.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { describe, expect, it } from "vitest";
import { GRID_SIZE, boxBlur, buildDensityGrid, buildRamp, hexToRgb, rampColor } from "./heatmapMath";

describe("hexToRgb", () => {
  it("parses 6 and 3 digit hex, with or without #", () => {
    expect(hexToRgb("#ff8000")).toEqual([255, 128, 0]);
    expect(hexToRgb("0f0")).toEqual([0, 255, 0]);
  });
  it("rejects invalid input", () => {
    expect(hexToRgb("nope")).toBeNull();
    expect(hexToRgb("12345")).toBeNull();
  });
});

describe("rampColor", () => {
  const ramp = buildRamp("2a78d6");
  it("clamps out of range values to the ends of the ramp", () => {
    expect(rampColor(ramp, -1).a).toBe(ramp[0]!.alpha);
    expect(rampColor(ramp, 2).a).toBe(ramp[ramp.length - 1]!.alpha);
  });
  it("falls back to the default color on an invalid hex", () => {
    expect(buildRamp("zzz")).toEqual(ramp);
  });
});

describe("density", () => {
  it("boxBlur keeps a uniform grid uniform", () => {
    const grid = new Float32Array(16).fill(2);
    expect(Array.from(boxBlur(grid, 4, 1))).toEqual(Array.from(grid));
  });
  it("puts the peak near the points and ignores NaN or out of range coordinates", () => {
    const grid = buildDensityGrid([{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: NaN, y: 0 }, { x: 5, y: -3 }]);
    const peak = grid.indexOf(Math.max(...grid));
    const [px, py] = [peak % GRID_SIZE, Math.floor(peak / GRID_SIZE)];
    expect(Math.abs(px - GRID_SIZE / 2)).toBeLessThanOrEqual(2);
    expect(Math.abs(py - GRID_SIZE / 2)).toBeLessThanOrEqual(2);
  });
});
