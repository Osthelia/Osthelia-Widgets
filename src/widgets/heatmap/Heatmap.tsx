/**
 * Osthelia-Widgets — Heatmap
 *
 * Heatmap widget: player positions density over the map image.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { WidgetFrame } from "../../components/WidgetFrame";
import { t } from "../../i18n";
import { useWidgetData } from "../../useWidgetData";
import { HeatmapCanvas, type Position } from "./HeatmapCanvas";
import "./heatmap.css";

type Data = { map: { key: string; imageUrl: string }; positions: Position[] };

function isData(body: unknown): body is Data {
  const data = body as Partial<Data> | null;
  return !!data && typeof data === "object" && !!data.map && Array.isArray(data.positions);
}

export function Heatmap() {
  const state = useWidgetData("heatmap", isData);
  const params = new URLSearchParams(window.location.search);
  const color = params.get("color");
  // "atk" (default) is the "def" orientation turned by 180°.
  const rotation = params.get("rotation")?.toLowerCase() === "def" ? "def" : "atk";

  return (
    <WidgetFrame state={state}>
      {({ map, positions }) => (
        <div className="heatmap-stage">
          <div className="heatmap" data-rotation={rotation}>
            <img className="heatmap-map" src={map.imageUrl} alt="" />
            <HeatmapCanvas positions={positions} color={color} label={t("heatmap", { map: map.key })} />
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
