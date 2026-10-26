/**
 * Osthelia-Widgets - Veto
 *
 * Live map veto widget: the pool with the bans, picks, sides and decider as
 * they happen, in the style of the official VALORANT broadcast overlay.
 *
 * @copyright Copyright (c) 2026 Osthelia - Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md MIT
 * @link      https://github.com/Osthelia/Widgets
 */

import { useEffect, useState } from "react";
import { WidgetFrame } from "../../components/WidgetFrame";
import { TeamLogo } from "../../components/TeamLogo";
import { t } from "../../i18n";
import { useWidgetData } from "../../useWidgetData";
import "./veto.css";

type Team = { id: number; name: string; short_name: string | null; logo_url: string | null };
type Step = { kind: "ban" | "pick" | "side"; team_id: number | null; map_index: number | null };
type VetoRecord = { order: number; team_id: number; map_name: string; type: "ban" | "pick" | "decider"; side: "atk" | "def" | null; side_picked_by_team_id: number | null };
type Data = {
  status: "waiting" | "choosing" | "running" | "done";
  best_of: number;
  team_a: Team;
  team_b: Team;
  ready_a: boolean;
  ready_b: boolean;
  step_index: number | null;
  step_started_at: string | null;
  timeout_seconds: number;
  server_now: string;
  steps: Step[];
  pool: { name: string; image_url: string | null }[];
  vetos: VetoRecord[];
};

function isData(body: unknown): body is Data {
  const data = body as Partial<Data> | null;
  return !!data && typeof data === "object" && !!data.team_a && !!data.team_b && Array.isArray(data.pool) && Array.isArray(data.vetos) && Array.isArray(data.steps);
}

// The veto changes every few seconds, so this widget refreshes faster than the default 10s floor.
const LIVE_REFRESH = { defaultRefreshSeconds: 1, minRefreshSeconds: 1 };

// Same extra time the server adds to every action.
const GRACE_SECONDS = 3;

function useSecondsLeft(data: Data): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  if (data.status !== "running" || !data.step_started_at || data.timeout_seconds <= 0) return null;
  const offset = new Date(data.server_now).getTime() - Date.now();
  const end = new Date(data.step_started_at).getTime() + (data.timeout_seconds + GRACE_SECONDS) * 1000;
  return Math.min(data.timeout_seconds, Math.max(0, Math.ceil((end - (now + offset)) / 1000)));
}

function TeamTag({ team }: { team: Team }) {
  const name = team.short_name ?? team.name;
  return (
    <div className="veto-team">
      <TeamLogo name={name} logoUrl={team.logo_url} />
      <span className="veto-team-name">{name}</span>
    </div>
  );
}

function currentLabel(data: Data, teams: Map<number, Team>): string {
  if (data.status === "waiting") return t("vetoWaiting");
  if (data.status === "choosing") return t("vetoChoosing");
  if (data.status === "done") return t("vetoDone");
  const step = data.step_index !== null ? data.steps[data.step_index] : null;
  if (!step) return "";
  const team = step.team_id !== null ? teams.get(step.team_id) : null;
  const action = step.kind === "ban" ? t("ban") : step.kind === "pick" ? t("pick") : t("sideChoice");
  return `${team ? (team.short_name ?? team.name) : ""} ${action}`.trim();
}

export function Veto() {
  const state = useWidgetData("veto", isData, LIVE_REFRESH);

  return (
    <WidgetFrame state={state}>
      {(data) => <VetoBoard data={data} />}
    </WidgetFrame>
  );
}

type Column = { key: string; kind: "ban" | "pick" | "decider"; teamId: number | null; record: VetoRecord | null; current: boolean };

// One column per map action in veto order, then the decider.
function buildColumns(data: Data): Column[] {
  const mapSteps = data.steps.map((step, index) => ({ step, index })).filter((s) => s.step.kind !== "side");
  const played = data.vetos.filter((v) => v.type !== "decider");
  const columns: Column[] = mapSteps.map(({ step, index }, position) => ({
    key: `step-${position}`,
    kind: step.kind === "pick" ? "pick" : "ban",
    teamId: step.team_id,
    record: played[position] ?? null,
    current: data.status === "running" && data.step_index === index,
  }));
  const decider = data.vetos.find((v) => v.type === "decider") ?? null;
  const step = data.step_index !== null ? data.steps[data.step_index] : null;
  columns.push({
    key: "decider",
    kind: "decider",
    teamId: null,
    record: decider,
    current: data.status === "running" && step?.kind === "side" && step.map_index === data.best_of - 1,
  });
  return columns;
}

function BanIcon() {
  return (
    <svg className="veto-ban-icon" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="9" />
      <line x1="20.3" y1="20.3" x2="79.7" y2="79.7" stroke="currentColor" strokeWidth="9" />
    </svg>
  );
}

function VetoBoard({ data }: { data: Data }) {
  const seconds = useSecondsLeft(data);
  const teams = new Map<number, Team>([
    [data.team_a.id, data.team_a],
    [data.team_b.id, data.team_b],
  ]);
  const tagOf = (id: number | null) => {
    const team = id !== null ? teams.get(id) : undefined;
    return team ? (team.short_name ?? team.name) : "";
  };
  const imageOf = new Map(data.pool.map((m) => [m.name, m.image_url]));
  const columns = buildColumns(data);

  return (
    <div className="veto">
      <ol className="veto-maps">
        {columns.map((col) => {
          const record = col.record;
          const teamId = record && col.kind !== "decider" ? record.team_id : col.teamId;
          const header = col.kind === "decider" ? t("decider") : `${tagOf(teamId)} ${col.kind === "ban" ? t("ban") : t("pick")}`.trim();
          const image = record ? imageOf.get(record.map_name) : null;
          const sideTeam = record?.side_picked_by_team_id ?? null;
          return (
            <li key={col.key} className={`veto-col veto-col-${col.kind}${record ? "" : " veto-col-empty"}${col.current ? " veto-col-current" : ""}`}>
              <div className="veto-col-header">{header}</div>
              <div className="veto-col-body">
                {image && <img className="veto-map-image" src={image} alt="" />}
                {record && col.kind === "ban" && <BanIcon />}
                {record && <span className="veto-map-name">{record.map_name}</span>}
                {!record && col.current && <span className="veto-map-wait">...</span>}
              </div>
              <div className={`veto-col-side${record?.side && sideTeam !== null && col.kind !== "ban" ? "" : " veto-col-side-empty"}`}>
                {record?.side && sideTeam !== null && col.kind !== "ban" && `${tagOf(sideTeam)} ${record.side === "atk" ? t("attack") : t("defense")}`}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="veto-footer">
        <TeamTag team={data.team_a} />
        <div className="veto-center">
          <span className="veto-label">{currentLabel(data, teams)}</span>
          {seconds !== null && <span className={`veto-timer${seconds <= 10 ? " veto-timer-low" : ""}`}>{seconds}</span>}
        </div>
        <TeamTag team={data.team_b} />
      </div>
    </div>
  );
}
