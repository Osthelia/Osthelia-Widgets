/**
 * Osthelia-Widgets — HeatmapCanvas
 *
 * Canvas rendering of the position density heatmap.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { useEffect, useMemo, useRef } from "react";
import {
  CONTRAST_GAMMA, DEFAULT_COLOR, GRID_SIZE, NOISE_FLOOR,
  buildDensityGrid, buildRamp, rampColor,
  type Point, type RampStop,
} from "./heatmapMath";

export type Position = Point;

function render(canvas: HTMLCanvasElement, density: Float32Array, max: number, ramp: RampStop[]) {
  const wrapper = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  if (!wrapper || !ctx) return;
  const size = wrapper.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(size.width * dpr);
  canvas.height = Math.round(size.height * dpr);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (max === 0 || canvas.width === 0 || canvas.height === 0) return;

  const gridCanvas = document.createElement("canvas");
  gridCanvas.width = GRID_SIZE;
  gridCanvas.height = GRID_SIZE;
  const gridCtx = gridCanvas.getContext("2d");
  if (!gridCtx) return;
  const imageData = gridCtx.createImageData(GRID_SIZE, GRID_SIZE);

  for (let i = 0; i < density.length; i++) {
    const ratio = density[i]! / max;
    if (ratio <= NOISE_FLOOR) continue;
    const color = rampColor(ramp, Math.pow(ratio, CONTRAST_GAMMA));
    const o = i * 4;
    imageData.data[o] = color.r;
    imageData.data[o + 1] = color.g;
    imageData.data[o + 2] = color.b;
    imageData.data[o + 3] = color.a * 255;
  }
  gridCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(gridCanvas, 0, 0, canvas.width, canvas.height);
}

export function HeatmapCanvas({ positions, color, label }: { positions: Position[]; color: string | null; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The density only depends on the data: computed once, not on every resize.
  const { density, max } = useMemo(() => {
    const grid = buildDensityGrid(positions);
    return { density: grid, max: grid.reduce((m, v) => (v > m ? v : m), 0) };
  }, [positions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ramp = buildRamp(color || DEFAULT_COLOR);
    let frame = 0;
    const draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => render(canvas, density, max, ramp));
    };
    draw();
    // Observing the wrapper covers window resizes as well as layout changes after mount.
    const observer = new ResizeObserver(draw);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [density, max, color]);

  return <canvas ref={canvasRef} role="img" aria-label={label} />;
}
