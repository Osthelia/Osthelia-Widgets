/**
 * Osthelia-Widgets — HeadToHead
 *
 * Head-to-head widget: radar chart comparing two teams' win rates per map.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { WidgetFrame } from "../../components/WidgetFrame";
import { TeamLogo } from "../../components/TeamLogo";
import { t } from "../../i18n";
import { useWidgetData } from "../../useWidgetData";
import "./head-to-head.css";

type Team = { id: number; name: string; shortName: string | null; countryCode: string | null; logoUrl: string | null };
type MapRecord = { wins: number; timesPlayed: number; winPct: number };
type Row = { mapName: string; teamA: MapRecord; teamB: MapRecord };
type Data = { teamA: Team; teamB: Team; rows: Row[] };

function isData(body: unknown): body is Data {
  const data = body as Partial<Data> | null;
  return !!data && typeof data === "object" && !!data.teamA && !!data.teamB && Array.isArray(data.rows);
}

// Chart colors come from theme.css, so a fork restyles them there.
const COLOR_A = "var(--w-color-a)";
const COLOR_B = "var(--w-color-b)";

function RowTooltip({ active, payload, label }: { active?: boolean; payload?: { payload: Row }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]!.payload;
  return (
    <div className="tooltip">
      <strong>{label}</strong>
      <span style={{ color: COLOR_A }}>
        {row.teamA.wins}/{row.teamA.timesPlayed} ({row.teamA.winPct}%)
      </span>
      <span style={{ color: COLOR_B }}>
        {row.teamB.wins}/{row.teamB.timesPlayed} ({row.teamB.winPct}%)
      </span>
    </div>
  );
}

function TeamName({ team, color }: { team: Team; color: string }) {
  const name = team.shortName ?? team.name;
  return (
    <div className="h2h-team">
      <span className="dot" style={{ background: color }} />
      <TeamLogo name={name} logoUrl={team.logoUrl} />
      <span className="h2h-name">{name}</span>
    </div>
  );
}

export function HeadToHead() {
  const state = useWidgetData("head-to-head", isData);

  return (
    <WidgetFrame state={state}>
      {({ teamA, teamB, rows }) => (
        <div className="h2h">
          <div className="h2h-header">
            <TeamName team={teamA} color={COLOR_A} />
            <TeamName team={teamB} color={COLOR_B} />
          </div>
          {rows.length === 0 ? (
            <p className="message">{t("noData")}</p>
          ) : (
            <div className="h2h-chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={rows} outerRadius="70%">
                  <PolarGrid stroke="var(--w-grid)" />
                  <PolarAngleAxis dataKey="mapName" tick={{ fill: "var(--w-muted)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--w-muted)", fontSize: 9 }} tickCount={5} />
                  <Radar name={teamA.name} dataKey="teamA.winPct" stroke={COLOR_A} fill={COLOR_A} fillOpacity={0.18} strokeWidth={2} />
                  <Radar name={teamB.name} dataKey="teamB.winPct" stroke={COLOR_B} fill={COLOR_B} fillOpacity={0.18} strokeWidth={2} />
                  <Tooltip content={<RowTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </WidgetFrame>
  );
}
